from django.http import HttpResponse
from django.shortcuts import render
from django.template import Context, loader
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def index(request):
    return render(request, 'geocodingservice/index.html',{'base_dir':BASE_DIR})
