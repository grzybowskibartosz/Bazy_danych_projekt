from django.shortcuts import render
from django.http import JsonResponse
from .models import Pacjent, Lekarz, Wizyta, Gabinet


def get_posts(request):
    posts = Post.objects.all()
    data = {"posts": [{"title": post.title, "content": post.content} for post in posts]}
    return JsonResponse(data)


