from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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

class LiteracyScores(models.Model):
    phonological_awareness = models.FloatField()  # Section 1 percentage
    vocabulary_understanding = models.FloatField()  # Section 2 percentage
    sentence_comprehension = models.FloatField()  # Section 3 percentage
    logical_reasoning = models.FloatField()  # Section 4 percentage
    reading_comprehension = models.FloatField()  # Section 5 percentage
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        get_latest_by = 'timestamp'

class NumeracyScores(models.Model):
    number_sense = models.FloatField()  # Section 7 percentage
    basic_arithmetic = models.FloatField()  # Section 8 percentage
    number_sequencing = models.FloatField()  # Section 9 percentage
    spatial_awareness = models.FloatField()  # Section 10 percentage
    memory_math = models.FloatField()  # Section 11 percentage
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        get_latest_by = 'timestamp'

class HandwritingSubmission(models.Model):
    image = models.ImageField(upload_to='handwriting_samples/%Y%m%d/')
    submission_date = models.DateTimeField(auto_now_add=True)
    paragraph_text = models.TextField(default="The little brown dog ran across the garden...")

    def __str__(self):
        return f"Handwriting Submission - {self.submission_date}"

    class Meta:
        get_latest_by = 'submission_date'
