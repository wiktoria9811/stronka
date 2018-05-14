from django.urls import include, path
from stronka import views

from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', admin.site.urls)
]
