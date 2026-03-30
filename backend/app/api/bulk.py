import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User, ClothingItem, ClothingCategory
from app.schemas.schemas import ClothingResponse, CSVImportRequest, CSVExportResponse
from app.api.auth import get_current_user
from app.middleware.rate_limit import limiter, DEFAULT_RATE_LIMIT

router = APIRouter()


@router.post("/clothing-items/import", response_model=CSVImportRequest)
@limiter.limit(DEFAULT_RATE_LIMIT)
def import_clothing_csv(
    request: CSVImportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    批量导入衣物CSV

    CSV格式 (header):
    name,category,color,season,brand,size,tags

    示例:
    name,category,color,season,brand,size,tags
    T恤,TOPS,红色,spring,Uniqlo,M,休闲
    牛仔裤,BOTTOMS,蓝色,fall,Levis,30,百搭
    """
    if not request.csv_data.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV data is empty"
        )

    reader = csv.DictReader(io.StringIO(request.csv_data))
    imported_count = 0
    errors = []

    for row_num, row in enumerate(reader, start=2):  # start=2 因为第一行是header
        try:
            # 验证必需字段
            name = row.get('name', '').strip()
            category_str = row.get('category', '').strip().upper()

            if not name:
                errors.append(f"Row {row_num}: Missing name")
                continue

            # 验证category
            try:
                category = ClothingCategory(category_str)
            except ValueError:
                valid_categories = [c.value for c in ClothingCategory]
                errors.append(f"Row {row_num}: Invalid category '{category_str}'. Valid: {valid_categories}")
                continue

            # 创建衣物项
            clothing = ClothingItem(
                name=name,
                category=category,
                color=row.get('color', '').strip() or None,
                season=row.get('season', '').strip() or None,
                brand=row.get('brand', '').strip() or None,
                size=row.get('size', '').strip() or None,
                tags=row.get('tags', '').strip() or None,
                user_id=current_user.id
            )
            db.add(clothing)
            imported_count += 1

        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")

    # 提交所有成功的记录
    db.commit()

    return {
        "success": True,
        "imported_count": imported_count,
        "total_errors": len(errors),
        "errors": errors[:10]  # 最多返回前10个错误
    }


@router.get("/clothing-items/export")
def export_clothing_csv(
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    导出衣物CSV

    可选参数:
    - category: 过滤特定分类的衣物
    """
    query = db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id)

    if category:
        try:
            category_enum = ClothingCategory(category.upper())
            query = query.filter(ClothingItem.category == category_enum)
        except ValueError:
            valid_categories = [c.value for c in ClothingCategory]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category. Valid: {valid_categories}"
            )

    clothing_items = query.all()

    # 生成CSV
    output = io.StringIO()
    fieldnames = ['name', 'category', 'color', 'season', 'brand', 'size', 'tags']
    writer = csv.DictWriter(output, fieldnames=fieldnames)

    writer.writeheader()
    for item in clothing_items:
        writer.writerow({
            'name': item.name,
            'category': item.category.value,
            'color': item.color or '',
            'season': item.season or '',
            'brand': item.brand or '',
            'size': item.size or '',
            'tags': item.tags or ''
        })

    csv_content = output.getvalue()

    return StreamingResponse(
        io.BytesIO(csv_content.encode('utf-8')),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=wardrobe_export.csv"
        }
    )


@router.post("/outfits/import")
@limiter.limit(DEFAULT_RATE_LIMIT)
def import_outfits_csv(
    request: CSVImportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    批量导入搭配CSV

    CSV格式 (header):
    name,description,style_tags,occasion,season

    示例:
    name,description,style_tags,occasion,season
    周末休闲,轻松舒适的周末装扮,休闲;舒适,casual,summer
    商务正装,正式商务场合,商务;正式,formal,fall
    """
    if not request.csv_data.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV data is empty"
        )

    from app.models.models import Outfit

    reader = csv.DictReader(io.StringIO(request.csv_data))
    imported_count = 0
    errors = []

    for row_num, row in enumerate(reader, start=2):
        try:
            name = row.get('name', '').strip()

            if not name:
                errors.append(f"Row {row_num}: Missing name")
                continue

            outfit = Outfit(
                name=name,
                description=row.get('description', '').strip() or None,
                style_tags=row.get('style_tags', '').strip() or None,
                occasion=row.get('occasion', '').strip() or None,
                season=row.get('season', '').strip() or None,
                user_id=current_user.id
            )
            db.add(outfit)
            imported_count += 1

        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")

    db.commit()

    return {
        "success": True,
        "imported_count": imported_count,
        "total_errors": len(errors),
        "errors": errors[:10]
    }


@router.get("/outfits/export")
def export_outfits_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    导出搭配CSV
    """
    from app.models.models import Outfit

    outfits = db.query(Outfit).filter(Outfit.user_id == current_user.id).all()

    output = io.StringIO()
    fieldnames = ['name', 'description', 'style_tags', 'occasion', 'season']
    writer = csv.DictWriter(output, fieldnames=fieldnames)

    writer.writeheader()
    for outfit in outfits:
        writer.writerow({
            'name': outfit.name,
            'description': outfit.description or '',
            'style_tags': outfit.style_tags or '',
            'occasion': outfit.occasion or '',
            'season': outfit.season or ''
        })

    csv_content = output.getvalue()

    return StreamingResponse(
        io.BytesIO(csv_content.encode('utf-8')),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=outfits_export.csv"
        }
    )
