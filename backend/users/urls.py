from django.urls import path
from . import views

urlpatterns = [
    path('csrf-token/', views.get_csrf_token, name='csrf-token'),
    path('save-student-assessment/', views.save_student_assessment, name='save-student-assessment'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('save-assessment-scores/', views.save_assessment_scores, name='save-assessment-scores'),
    path('save-handwriting/', views.save_handwriting, name='save-handwriting'),
]
