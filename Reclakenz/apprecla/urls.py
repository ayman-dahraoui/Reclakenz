from django.urls import path
from .views import (
    RegisterView, ProfileView, ReclamationView, ReclamationDetailView, ReclamationDetailsForApprovedView, TypeReclamationView,
    AdminUserView, AdminUserDetailView, AdminCompanyView, AdminCompanyDetailView,
    SimpleRequestView, SimpleRequestDetailView, AllReclamationsView, CommercialStatusView,
    QualityAgentDashboardView, PendingRegistrationsView, PhotoUploadView, ArticleView, ArticleDetailView,
    ArticleVariantView, ArticleVariantDetailView, NotificationView, ReclamationMessageView,
    TestReclamationArticlesView, ReportView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('reclamations/', ReclamationView.as_view(), name='reclamations'),
    path('reclamations/<int:pk>/', ReclamationDetailView.as_view(), name='reclamation-detail'),
    path('reclamations-details/<int:pk>/', ReclamationDetailsForApprovedView.as_view(), name='reclamation-details-approved'),
    path('reclamations/<int:reclamation_id>/photos/', PhotoUploadView.as_view(), name='photo-upload'),
    path('reclamations/<int:reclamation_id>/photos/<int:photo_id>/', PhotoUploadView.as_view(), name='photo-delete'),
    # Rapports de traitement
    path('reclamations/<int:reclamation_id>/reports/', ReportView.as_view(), name='reclamation-reports'),
    path('types-reclamation/', TypeReclamationView.as_view(), name='types-reclamation'),
    path('articles/', ArticleView.as_view(), name='articles'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:article_id>/variants/', ArticleVariantView.as_view(), name='article-variants'),
    path('variants/<int:pk>/', ArticleVariantDetailView.as_view(), name='variant-detail'),
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('notifications/<int:pk>/', NotificationView.as_view(), name='notification-detail'),
    # Chat messages par réclamation
    path('reclamations/<int:reclamation_id>/messages/', ReclamationMessageView.as_view(), name='reclamation-messages'),
    path('test-reclamations/', ReclamationView.as_view(), name='test-reclamations'),  # Pour tester
    path('test-reclamation-articles/<int:pk>/', TestReclamationArticlesView.as_view(), name='test-reclamation-articles'),  # Pour tester les articles
    
    # URLs pour la gestion administrative
    path('admin/users/', AdminUserView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/companies/', AdminCompanyView.as_view(), name='admin-companies'),
    path('admin/companies/<int:pk>/', AdminCompanyDetailView.as_view(), name='admin-company-detail'),
    

    
    # URLs pour les demandes simples
    path('simple-requests/', SimpleRequestView.as_view(), name='simple-requests'),
    path('simple-requests/<int:pk>/', SimpleRequestDetailView.as_view(), name='simple-request-detail'),
    
    # URLs pour toutes les réclamations (utilisateurs approuvés)
    path('all-reclamations/', AllReclamationsView.as_view(), name='all-reclamations'),
    path('all-reclamations/<int:pk>/', AllReclamationsView.as_view(), name='all-reclamation-detail'),
    
    # URL pour vérifier le statut Commercial
    path('commercial-status/', CommercialStatusView.as_view(), name='commercial-status'),
    # URLs pour le tableau de bord des agents qualité
    path('quality-dashboard/', QualityAgentDashboardView.as_view(), name='quality-dashboard'),
    path('quality-dashboard/<int:pk>/', QualityAgentDashboardView.as_view(), name='quality-dashboard-detail'),
    path('pending-registrations/', PendingRegistrationsView.as_view(), name='pending-registrations'),
    path('pending-registrations/<int:pk>/', PendingRegistrationsView.as_view(), name='pending-registration-detail'),
]