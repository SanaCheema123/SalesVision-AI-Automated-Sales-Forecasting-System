import csv
import io
from typing import List, Dict, Any


def export_to_csv(data: List[Dict[str, Any]], filename: str = "export.csv") -> io.StringIO:
    if not data:
        return io.StringIO()
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    output.seek(0)
    return output
