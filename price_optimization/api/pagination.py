# your_app/pagination.py

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'  # allow client to set page size

    def get_paginated_response(self, data):
        return Response(data)  # Only return the paginated list (no count, next, etc.)
