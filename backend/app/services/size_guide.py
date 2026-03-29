"""
Size Guide Database Service.
"""
from typing import Dict, List, Optional, Any
from dataclasses import dataclass


@dataclass
class SizeRecommendation:
    """Size recommendation result."""
    recommended_size: str
    confidence: float
    fit_notes: str
    alternatives: List[str]


class SizeGuideService:
    """Service for size recommendations based on body measurements."""

    # Brand size databases (simplified)
    BRAND_SIZE_GUIDES: Dict[str, Dict[str, Any]] = {
        "zara": {
            "tops": {
                "male": {
                    "XS": {"chest_cm": (86, 91), "height_cm": (165, 175)},
                    "S": {"chest_cm": (91, 96), "height_cm": (168, 178)},
                    "M": {"chest_cm": (96, 101), "height_cm": (173, 183)},
                    "L": {"chest_cm": (101, 106), "height_cm": (178, 188)},
                    "XL": {"chest_cm": (106, 111), "height_cm": (183, 193)},
                },
                "female": {
                    "XS": {"chest_cm": (82, 86), "height_cm": (158, 168)},
                    "S": {"chest_cm": (86, 90), "height_cm": (162, 172)},
                    "M": {"chest_cm": (90, 94), "height_cm": (166, 176)},
                    "L": {"chest_cm": (94, 98), "height_cm": (170, 180)},
                    "XL": {"chest_cm": (98, 102), "height_cm": (174, 184)},
                }
            },
            "bottoms": {
                "male": {
                    "XS": {"waist_cm": (71, 76), "height_cm": (165, 175)},
                    "S": {"waist_cm": (76, 81), "height_cm": (168, 178)},
                    "M": {"waist_cm": (81, 86), "height_cm": (173, 183)},
                    "L": {"waist_cm": (86, 91), "height_cm": (178, 188)},
                    "XL": {"waist_cm": (91, 96), "height_cm": (183, 193)},
                },
                "female": {
                    "XS": {"waist_cm": (58, 62), "height_cm": (158, 168)},
                    "S": {"waist_cm": (62, 66), "height_cm": (162, 172)},
                    "M": {"waist_cm": (66, 70), "height_cm": (166, 176)},
                    "L": {"waist_cm": (70, 74), "height_cm": (170, 180)},
                    "XL": {"waist_cm": (74, 78), "height_cm": (174, 184)},
                }
            }
        },
        "hm": {
            "tops": {
                "male": {
                    "XS": {"chest_cm": (88, 93), "height_cm": (166, 176)},
                    "S": {"chest_cm": (93, 98), "height_cm": (170, 180)},
                    "M": {"chest_cm": (98, 103), "height_cm": (175, 185)},
                    "L": {"chest_cm": (103, 108), "height_cm": (180, 190)},
                    "XL": {"chest_cm": (108, 113), "height_cm": (185, 195)},
                },
                "female": {
                    "XS": {"chest_cm": (84, 88), "height_cm": (160, 170)},
                    "S": {"chest_cm": (88, 92), "height_cm": (164, 174)},
                    "M": {"chest_cm": (92, 96), "height_cm": (168, 178)},
                    "L": {"chest_cm": (96, 100), "height_cm": (172, 182)},
                    "XL": {"chest_cm": (100, 104), "height_cm": (176, 186)},
                }
            },
            "bottoms": {
                "male": {
                    "XS": {"waist_cm": (73, 78), "height_cm": (166, 176)},
                    "S": {"waist_cm": (78, 83), "height_cm": (170, 180)},
                    "M": {"waist_cm": (83, 88), "height_cm": (175, 185)},
                    "L": {"waist_cm": (88, 93), "height_cm": (180, 190)},
                    "XL": {"waist_cm": (93, 98), "height_cm": (185, 195)},
                },
                "female": {
                    "XS": {"waist_cm": (60, 64), "height_cm": (160, 170)},
                    "S": {"waist_cm": (64, 68), "height_cm": (164, 174)},
                    "M": {"waist_cm": (68, 72), "height_cm": (168, 178)},
                    "L": {"waist_cm": (72, 76), "height_cm": (172, 182)},
                    "XL": {"waist_cm": (76, 80), "height_cm": (176, 186)},
                }
            }
        },
        "uniqlo": {
            "tops": {
                "male": {
                    "XS": {"chest_cm": (84, 89), "height_cm": (163, 173)},
                    "S": {"chest_cm": (89, 94), "height_cm": (168, 178)},
                    "M": {"chest_cm": (94, 99), "height_cm": (173, 183)},
                    "L": {"chest_cm": (99, 104), "height_cm": (178, 188)},
                    "XL": {"chest_cm": (104, 109), "height_cm": (183, 193)},
                },
                "female": {
                    "XS": {"chest_cm": (80, 84), "height_cm": (155, 165)},
                    "S": {"chest_cm": (84, 88), "height_cm": (160, 170)},
                    "M": {"chest_cm": (88, 92), "height_cm": (165, 175)},
                    "L": {"chest_cm": (92, 96), "height_cm": (170, 180)},
                    "XL": {"chest_cm": (96, 100), "height_cm": (175, 185)},
                }
            },
            "bottoms": {
                "male": {
                    "XS": {"waist_cm": (70, 75), "height_cm": (163, 173)},
                    "S": {"waist_cm": (75, 80), "height_cm": (168, 178)},
                    "M": {"waist_cm": (80, 85), "height_cm": (173, 183)},
                    "L": {"waist_cm": (85, 90), "height_cm": (178, 188)},
                    "XL": {"waist_cm": (90, 95), "height_cm": (183, 193)},
                },
                "female": {
                    "XS": {"waist_cm": (58, 62), "height_cm": (155, 165)},
                    "S": {"waist_cm": (62, 66), "height_cm": (160, 170)},
                    "M": {"waist_cm": (66, 70), "height_cm": (165, 175)},
                    "L": {"waist_cm": (70, 74), "height_cm": (170, 180)},
                    "XL": {"waist_cm": (74, 78), "height_cm": (175, 185)},
                }
            }
        }
    }

    def get_size_guide(self, brand: str, category: str = None, gender: str = "male") -> Dict[str, Any]:
        """
        Get size guide for a brand.

        Args:
            brand: Brand name (zara, hm, uniqlo)
            category: Clothing category (tops, bottoms)
            gender: Gender (male, female)

        Returns:
            Size guide data
        """
        brand_lower = brand.lower()
        if brand_lower not in self.BRAND_SIZE_GUIDES:
            return {"error": f"Brand '{brand}' not found", "supported_brands": list(self.BRAND_SIZE_GUIDES.keys())}

        brand_data = self.BRAND_SIZE_GUIDES[brand_lower]

        if category:
            if category in brand_data:
                return {"brand": brand, "category": category, "gender": gender, "sizes": brand_data[category].get(gender, {})}
            return {"error": f"Category '{category}' not found for brand '{brand}'"}

        return {"brand": brand, "categories": list(brand_data.keys())}

    def recommend_size(
        self,
        brand: str,
        category: str,
        body_measurements: Dict[str, Any]
    ) -> Optional[SizeRecommendation]:
        """
        Recommend size based on body measurements.

        Args:
            brand: Brand name
            category: Clothing category (tops, bottoms)
            body_measurements: Dict with height_cm, weight_kg, chest_cm, waist_cm, etc.

        Returns:
            Size recommendation
        """
        brand_lower = brand.lower()
        if brand_lower not in self.BRAND_SIZE_GUIDES:
            return None

        brand_data = self.BRAND_SIZE_GUIDES[brand_lower]
        if category not in brand_data:
            return None

        gender = body_measurements.get("gender", "male").lower()
        if gender not in ["male", "female"]:
            gender = "male"

        size_guides = brand_data[category].get(gender, {})

        # Find best matching size
        best_match = None
        best_score = 0

        for size, ranges in size_guides.items():
            score = self._calculate_fit_score(body_measurements, ranges)
            if score > best_score:
                best_score = score
                best_match = size

        if best_match is None:
            best_match = "M"  # Default fallback

        # Get alternatives
        size_order = list(size_guides.keys())
        current_idx = size_order.index(best_match) if best_match in size_order else 2
        alternatives = []
        if current_idx > 0:
            alternatives.append(size_order[current_idx - 1])
        if current_idx < len(size_order) - 1:
            alternatives.append(size_order[current_idx + 1])

        fit_notes = self._generate_fit_notes(body_measurements, best_match, size_guides[best_match])

        return SizeRecommendation(
            recommended_size=best_match,
            confidence=min(best_score / 100, 1.0),
            fit_notes=fit_notes,
            alternatives=alternatives
        )

    def _calculate_fit_score(self, measurements: Dict, size_ranges: Dict) -> float:
        """Calculate how well measurements fit a size."""
        score = 100.0

        if "chest_cm" in measurements and "chest_cm" in size_ranges:
            chest = measurements["chest_cm"]
            min_c, max_c = size_ranges["chest_cm"]
            if chest < min_c:
                score -= (min_c - chest) * 2
            elif chest > max_c:
                score -= (chest - max_c) * 2

        if "waist_cm" in measurements and "waist_cm" in size_ranges:
            waist = measurements["waist_cm"]
            min_w, max_w = size_ranges["waist_cm"]
            if waist < min_w:
                score -= (min_w - waist) * 2
            elif waist > max_w:
                score -= (waist - max_w) * 2

        if "height_cm" in measurements and "height_cm" in size_ranges:
            height = measurements["height_cm"]
            min_h, max_h = size_ranges["height_cm"]
            if height < min_h:
                score -= (min_h - height) * 1.5
            elif height > max_h:
                score -= (height - max_h) * 1.5

        return max(0, score)

    def _generate_fit_notes(self, measurements: Dict, size: str, size_range: Dict) -> str:
        """Generate fit notes based on body measurements."""
        notes = []

        if "chest_cm" in measurements and "chest_cm" in size_range:
            chest = measurements["chest_cm"]
            min_c, max_c = size_range["chest_cm"]
            if chest < min_c:
                notes.append("建议选择修身款式以避免过于宽松")
            elif chest > max_c:
                notes.append("建议选择宽松款式或考虑大一码")

        if "height_cm" in measurements and "height_cm" in size_range:
            height = measurements["height_cm"]
            min_h, max_h = size_range["height_cm"]
            if height < min_h:
                notes.append("建议选择短款或Crop版型")
            elif height > max_h:
                notes.append("建议选择长款或加长版型")

        return "; ".join(notes) if notes else f"Size {size} should provide a comfortable fit"


# Singleton instance
size_guide_service = SizeGuideService()