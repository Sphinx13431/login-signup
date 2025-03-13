from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('csrf-token/', views.get_csrf_token, name='csrf-token'),
    path('save-student-assessment/', views.save_student_assessment, name='save-student-assessment'),
]
