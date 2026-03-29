"""
MiniMax AI Service for image generation and recommendation.
"""
import httpx
import base64
import json
from typing import Optional, List, Dict, Any
from app.core.config import settings


class MiniMaxService:
    """MiniMax AI service for text and image generation."""

    BASE_URL = "https://api.minimax.chat/v1"

    def __init__(self):
        self.api_key = settings.MINIMAX_API_KEY
        self.group_id = settings.MINIMAX_GROUP_ID

    def _get_headers(self) -> Dict[str, str]:
        """Get request headers."""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def generate_text(
        self,
        prompt: str,
        model: str = "MiniMax-Text-01",
        max_tokens: int = 1000
    ) -> Optional[str]:
        """Generate text using MiniMax model."""
        if not self.api_key:
            return None

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.BASE_URL}/text/chatcompletion_v2",
                    headers=self._get_headers(),
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": max_tokens
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("choices", [{}])[0].get("message", {}).get("content")
            except Exception:
                pass
        return None

    async def generate_outfit_recommendation(
        self,
        body_data: Dict[str, Any],
        occasion: str,
        season: str,
        existing_items: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Generate outfit recommendation based on body data and preferences.

        Args:
            body_data: User's body measurements (height, weight, etc.)
            occasion: Occasion type (casual, formal, work, etc.)
            season: Season (spring, summer, fall, winter)
            existing_items: User's existing clothing items

        Returns:
            Recommended outfit combination
        """
        if not self.api_key:
            return self._get_fallback_recommendation(body_data, occasion, season, existing_items)

        items_summary = "\n".join([
            f"- {item.get('name', 'Unknown')}: {item.get('category', 'unknown')} ({item.get('color', 'unknown')})"
            for item in existing_items
        ])

        prompt = f"""根据用户信息推荐穿搭组合:

用户体型数据:
- 身高: {body_data.get('height', 'N/A')}cm
- 体重: {body_data.get('weight', 'N/A')}kg
- 性别: {body_data.get('gender', 'N/A')}
- 胸围: {body_data.get('chest', 'N/A')}cm
- 腰围: {body_data.get('waist', 'N/A')}cm

场合: {occasion}
季节: {season}

用户现有衣物:
{items_summary}

请用JSON格式返回推荐，格式如下:
{{
  "top": "衣物名称",
  "bottom": "衣物名称",
  "outerwear": "衣物名称(可选)",
  "shoes": "推荐鞋款",
  "accessories": ["配件1", "配件2"],
  "style_tips": "穿搭建议",
  "color_palette": ["主色", "辅色"]
}}

只返回JSON，不要其他内容。"""

        try:
            result = await self.generate_text(prompt)
            if result:
                # Extract JSON from response
                json_start = result.find("{")
                json_end = result.rfind("}") + 1
                if json_start != -1 and json_end != 0:
                    return json.loads(result[json_start:json_end])
        except Exception:
            pass

        return self._get_fallback_recommendation(body_data, occasion, season, existing_items)

    def _get_fallback_recommendation(
        self,
        body_data: Dict[str, Any],
        occasion: str,
        season: str,
        existing_items: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Fallback recommendation when AI is unavailable."""
        tops = [i for i in existing_items if i.get('category') == 'tops']
        bottoms = [i for i in existing_items if i.get('category') == 'bottoms']
        outerwear = [i for i in existing_items if i.get('category') == 'outerwear']

        style_tips = self._generate_style_tips(body_data, occasion, season)

        return {
            "top": tops[0].get('name', '衬衫') if tops else '衬衫',
            "bottom": bottoms[0].get('name', '裤子') if bottoms else '裤子',
            "outerwear": outerwear[0].get('name') if outerwear else None,
            "shoes": self._get_recommended_shoes(occasion),
            "accessories": self._get_recommended_accessories(occasion),
            "style_tips": style_tips,
            "color_palette": self._get_color_palette(season)
        }

    def _generate_style_tips(self, body_data: Dict, occasion: str, season: str) -> str:
        """Generate style tips based on body type."""
        height = body_data.get('height', 170)
        weight = body_data.get('weight', 65)

        tips = []
        if height < 165:
            tips.append("建议选择高腰款式以拉长身材比例")
        elif height > 180:
            tips.append("可以选择宽松款式平衡视觉")

        if occasion == 'formal':
            tips.append("正式场合建议选择深色系服装")
        elif occasion == 'casual':
            tips.append("休闲场合可以尝试亮色或印花元素")

        return "; ".join(tips) if tips else "基础穿搭建议"

    def _get_recommended_shoes(self, occasion: str) -> str:
        """Get recommended shoes based on occasion."""
        shoes_map = {
            'formal': '商务皮鞋',
            'work': '简约皮鞋/乐福鞋',
            'casual': '运动鞋/帆布鞋',
            'sport': '运动鞋',
            'date': '休闲皮鞋/小白鞋'
        }
        return shoes_map.get(occasion, '休闲鞋')

    def _get_recommended_accessories(self, occasion: str) -> List[str]:
        """Get recommended accessories based on occasion."""
        accessories_map = {
            'formal': ['手表', '皮带'],
            'work': ['手表', '公文包'],
            'casual': ['帽子', '背包'],
            'sport': ['运动手表', '运动腰包'],
            'date': ['简约项链', '手表']
        }
        return accessories_map.get(occasion, ['手表'])

    def _get_color_palette(self, season: str) -> List[str]:
        """Get recommended color palette based on season."""
        palettes = {
            'spring': ['浅蓝', '粉色', '米白', '浅绿'],
            'summer': ['白色', '浅灰', '天蓝', '薄荷绿'],
            'fall': ['棕色', '深绿', '卡其色', '橙色'],
            'winter': ['深灰', '海军蓝', '黑色', '酒红']
        }
        return palettes.get(season, ['黑色', '白色', '灰色'])


# Singleton instance
minimax_service = MiniMaxService()