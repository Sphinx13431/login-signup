from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
import tensorflow as tf
from tensorflow import keras
import pickle
import pandas as pd
import os
# Update imports to include new models
from .models import (
    StudentAssessment,
    LiteracyScores,
    NumeracyScores,
    HandwritingSubmission  # Add this line
)
import logging
from django.views.decorators.http import require_POST
from rest_framework.parsers import MultiPartParser, FormParser


def load_and_prep_image(filename, img_shape=256, scale=True):
  img = tf.io.read_file(filename)
  img = tf.io.decode_image(img, channels=3)
  img = tf.image.resize(img, [img_shape, img_shape])
  if scale:
    return img/255.
  else:
    return img
  

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'login': reverse('login', request=request, format=format),
        'signup': reverse('signup', request=request, format=format),
        'logout': reverse('logout', request=request, format=format),
    })

@api_view(['POST'])
def signup_view(request):
    try:
        data = request.data
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'status': 'error', 'message': 'Email already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'status': 'error', 'message': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['name']
        )

        login(request, user)
        return Response({
            'status': 'success',
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Signup error: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])  # This is correct - only allowing POST method
def login_view(request):
    try:
        data = request.data
        user = authenticate(username=data['email'], password=data['password'])
        if user is not None:
            login(request, user)
            return Response({
                'status': 'Success',
                'user': {
                    'email': user.email,
                    'name': user.first_name
                }
            })
        return Response(
            {'status': 'error', 'message': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        print(f"Login error: {str(e)}")
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@ensure_csrf_cookie
def logout_view(request):
    try:
        logout(request)
        response = Response({'status': 'success'})
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        return response
    except Exception as e:
        print(f"Logout error: {str(e)}")  # Add debugging
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    try:
        token = get_token(request)
        return Response({
            'csrfToken': token
        })
    except Exception as e:
        print(f"Error generating CSRF token: {str(e)}")
        return Response({
            'error': 'Failed to generate CSRF token'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@ensure_csrf_cookie
@require_POST
def save_student_assessment(request):
    print("Request received:", request.method)
    print("Headers:", dict(request.headers))
    print("User authenticated:", request.user.is_authenticated)

    if not request.user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        data = request.data
        print("Received data:", data)  # Debug print

        # Validate required fields
        required_fields = ['studentName', 'age', 'grade', 'yesCount']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return Response({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create new assessment entry
        assessment = StudentAssessment.objects.create(
            student_name=data['studentName'],
            age=int(data['age']),
            grade=str(data['grade']),
            yes_count=int(data['yesCount']),
            submitted_by=request.user
        )

        print(f"Assessment created: {assessment}")  # Debug print

        return Response({
            'status': 'success',
            'message': 'Assessment saved successfully',
            'yes_count': assessment.yes_count
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        import traceback
        print("Error traceback:", traceback.format_exc())
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@ensure_csrf_cookie  # Add this decorator
def save_assessment_scores(request):
    try:
        data = request.data
        print("Received assessment scores:", data)

        try:
            # Create literacy scores and get prediction
            literacy_scores = LiteracyScores.objects.create(
                phonological_awareness=data['section1_percentage'],
                vocabulary_understanding=data['section2_percentage'],
                sentence_comprehension=data['section3_percentage'],
                logical_reasoning=data['section4_percentage'],
                reading_comprehension=data['section5_percentage']
            )
            
            list1 = [
                100 - data['section1_percentage'],
                100 - data['section2_percentage'], 
                100 - data['section3_percentage'], 
                100 - data['section4_percentage'],
                100 - data['section5_percentage']
            ]
            new_data = pd.DataFrame([list1])
            dyslexia_model_path = '/home/vishnu134/Desktop/django/login-signup/mlModels/decision-tree-model1.pickle'
            clf = pickle.load(open(dyslexia_model_path, 'rb'))
            prediction_x2 = clf.predict(new_data)[0]  # Get first prediction

            # Create numeracy scores and get prediction
            numeracy_scores = NumeracyScores.objects.create(
                number_sense=data['section7_percentage'],
                basic_arithmetic=data['section8_percentage'],
                number_sequencing=data['section9_percentage'],
                spatial_awareness=data['section10_percentage'],
                memory_math=data['section11_percentage']
            )
            
            list2 = [
                100 - data['section7_percentage'],
                100 - data['section8_percentage'], 
                100 - data['section9_percentage'], 
                100 - data['section10_percentage'],
                100 - data['section11_percentage']
            ]
            new_data = pd.DataFrame([list2])
            dyscalculia_model_path = '/home/vishnu134/Desktop/django/login-signup/mlModels/decision-tree.pickle'
            clf = pickle.load(open(dyscalculia_model_path, 'rb'))
            prediction_c1 = clf.predict(new_data)[0]  # Get first prediction

            # Get handwriting prediction from session
            prediction_x1 = request.session.get('prediction_x1', 0)
            prediction_x3 = 23  # Constant value as in original code

            # Calculate final predictions
            pred_x = (prediction_x1 * 4 + prediction_x2 + prediction_x3/3) / 16
            pred_c = prediction_c1 / 4

            # Convert to binary predictions
            pred_x = 1 if pred_x > 0.5 else 0
            pred_c = 1 if pred_c > 0.5 else 0

            # Generate result string
            result = []
            if pred_x == 1:
                result.append('Dyslexia')
            if pred_c == 1:
                result.append('Dyscalculia')
            final_result = ' '.join(result)
            print(f"Final prediction: {final_result}")
            return Response({
                'status': 'success',
                'literacy_scores': [
                    round(literacy_scores.phonological_awareness, 2),
                    round(literacy_scores.vocabulary_understanding, 2),
                    round(literacy_scores.sentence_comprehension, 2),
                    round(literacy_scores.logical_reasoning, 2),
                    round(literacy_scores.reading_comprehension, 2)
                ],
                'numeracy_scores': [
                    round(numeracy_scores.number_sense, 2),
                    round(numeracy_scores.basic_arithmetic, 2),
                    round(numeracy_scores.number_sequencing, 2),
                    round(numeracy_scores.spatial_awareness, 2),
                    round(numeracy_scores.memory_math, 2)
                ],
                'prediction_result': final_result
            }, status=status.HTTP_201_CREATED)

        except KeyError as e:
            print(f"Missing field in data: {e}")
            return Response({
                'status': 'error',
                'message': f'Missing required field: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        import traceback
        print(f"Error saving scores: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@ensure_csrf_cookie
def save_handwriting(request):
    if not request.FILES.get('image'):
        return Response({
            'status': 'error',
            'message': 'No image file provided'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        handwriting = HandwritingSubmission.objects.create(
            image=request.FILES['image']
        )
        
        # Update handwriting model path
        handwriting_model_path = '/home/vishnu134/Desktop/django/login-signup/mlModels/model_hand.h5'
        
        try:
            new_model = tf.keras.models.load_model(handwriting_model_path)
        except Exception as model_error:
            print(f"Error loading model: {str(model_error)}")
            return Response({
                'status': 'error',
                'message': 'Failed to load ML model'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Get the path of the saved image
        image_path = handwriting.image.path
        
        # Process the image
        img = load_and_prep_image(image_path, scale=False)
        img_expanded = tf.expand_dims(img, axis=0)
        
        try:
            # Handle different model prediction methods
            if isinstance(new_model, keras.layers.TFSMLayer):
                pred_prob = new_model(img_expanded)
            else:
                pred_prob = new_model.predict(img_expanded)
            
            prediction_x1 = pred_prob.argmax()
            
            # Store prediction in session for later use
            request.session['prediction_x1'] = int(prediction_x1)
            
            return Response({
                'status': 'success',
                'message': 'Handwriting image saved successfully',
                'image_url': handwriting.image.url,
                'prediction': int(prediction_x1)
            })
        except Exception as pred_error:
            print(f"Prediction error: {str(pred_error)}")
            return Response({
                'status': 'error',
                'message': 'Failed to process image'
            }, status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        print(f"Error saving handwriting: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)