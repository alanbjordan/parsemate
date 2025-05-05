from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

class ReceiptField(str, Enum):
    DATE = "Date"
    QTY = "Qty"
    ITEM_NUMBER = "Item_Number"
    ITEM_NAME = "Item_Name"
    VENDOR = "Vendor"
    AMOUNT = "Amount"
    TAX = "Tax"
    TOTAL = "Total"

class ReceiptItem(BaseModel):
    qty: Optional[str] = Field(None, alias="Qty")
    item_number: Optional[str] = Field(None, alias="Item_Number")
    item_name: Optional[str] = Field(None, alias="Item_Name")
    amount: Optional[str] = Field(None, alias="Amount")

class ReceiptData(BaseModel):
    date: Optional[str] = Field(None, alias="Date")
    vendor: Optional[str] = Field(None, alias="Vendor")
    items: List[ReceiptItem] = Field(default_factory=list)
    subtotal: Optional[str] = Field(None, alias="Subtotal")
    tax: Optional[str] = Field(None, alias="Tax")
    total: Optional[str] = Field(None, alias="Total") 
    payment_method: Optional[str] = Field(None, alias="Payment_Method")