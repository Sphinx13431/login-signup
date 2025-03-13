from django.db import models
from django.contrib.auth.models import User

class QuestionnaireResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    yes_count = models.IntegerField()
    total_questions = models.IntegerField()
    completion_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - Yes Count: {self.yes_count}/{self.total_questions}"

class StudentAssessment(models.Model):
    # Student Information
    student_name = models.CharField(max_length=100)
    age = models.IntegerField()
    grade = models.CharField(max_length=50)
    assessment_date = models.DateField(auto_now_add=True)
    
    # Questionnaire Results
    yes_count = models.IntegerField()
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.student_name} - Yes Count: {self.yes_count}/23"
