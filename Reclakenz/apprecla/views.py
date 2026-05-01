from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import UserProfile, Reclamation, SimpleRequest, Photo, Article, ReclamationArticle, ArticleVariant, Notification, ReclamationMessage, Report
from rest_framework import serializers

# Fonction utilitaire pour créer des notifications
def create_notification(user, reclamation, title, message, notification_type='status_change'):
    """Créer une notification pour un utilisateur"""
    Notification.objects.create(
        user=user,
        reclamation=reclamation,
        type=notification_type,
        title=title,
        message=message
    )

class PhotoSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    taille_formattee = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = [
            'id', 'client_id', 'client_name', 'nom_fichier', 'type_fichier',
            'taille_fichier', 'taille_formattee', 'description', 'date_upload', 'file_url'
        ]
        read_only_fields = ['id', 'date_upload', 'file_url', 'taille_formattee']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if request and obj.piece_jointe:
            return request.build_absolute_uri(obj.piece_jointe.url)
        return None

    def get_taille_formattee(self, obj):
        return obj.get_taille_formattee()


class ArticleVariantSerializer(serializers.ModelSerializer):
    weight_display = serializers.CharField(source='get_weight_display', read_only=True)
    
    class Meta:
        model = ArticleVariant
        fields = ['id', 'article', 'weight', 'weight_display', 'price', 'is_available']

class ArticleSerializer(serializers.ModelSerializer):
    societe_display = serializers.CharField(source='get_societe_display', read_only=True)
    variants = ArticleVariantSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'nom', 'societe', 'societe_display', 'image', 'image_url', 'variants']
        read_only_fields = ['id', 'societe_display', 'image_url']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ReclamationArticleSerializer(serializers.ModelSerializer):
    article = ArticleSerializer(read_only=True)
    variant = ArticleVariantSerializer(read_only=True)
    article_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    article_image_url = serializers.SerializerMethodField()
    article_name = serializers.CharField(source='article.nom', read_only=True)
    article_societe = serializers.CharField(source='article.get_societe_display', read_only=True)
    variant_display = serializers.SerializerMethodField()
    
    class Meta:
        model = ReclamationArticle
        fields = ['id', 'article', 'variant', 'article_id', 'variant_id', 'quantite', 'article_image_url', 'article_name', 'article_societe', 'variant_display']
        read_only_fields = ['id', 'article', 'article_image_url', 'article_name', 'article_societe', 'variant_display']
    
    def get_article_image_url(self, obj):
        """Retourne l'URL de l'image de l'article"""
        request = self.context.get('request')
        if obj.article and obj.article.image and request:
            return request.build_absolute_uri(obj.article.image.url)
        return None
    
    def get_variant_display(self, obj):
        """Retourne l'affichage de la variante"""
        if obj.variant:
            return obj.variant.get_weight_display()
        return None


class ReclamationSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)
    societe_display = serializers.CharField(source='get_societe_display', read_only=True)
    selected_articles = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    articles = ReclamationArticleSerializer(source='reclamationarticle_set', many=True, read_only=True)
    articles_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Reclamation
        fields = ['id', 'titre', 'type_reclamation', 'societe', 'societe_display', 'description', 'statut', 'date_creation', 'user', 'photos', 'selected_articles', 'articles', 'articles_count']
        read_only_fields = ['id', 'date_creation', 'statut', 'user', 'photos', 'societe_display', 'articles', 'articles_count']
    
    def get_articles_count(self, obj):
        """Retourne le nombre d'articles liés à cette réclamation"""
        return obj.reclamationarticle_set.count()

    def create(self, validated_data):
        selected_articles = validated_data.pop('selected_articles', [])
        reclamation = super().create(validated_data)
        
        # Créer les associations article-réclamation
        for article_data in selected_articles:
            article_id = article_data.get('articleId')
            variant_id = article_data.get('variantId')
            quantite = article_data.get('quantite', 1)
            
            if article_id:
                try:
                    article = Article.objects.get(id=article_id)
                    variant = None
                    if variant_id:
                        try:
                            variant = ArticleVariant.objects.get(id=variant_id)
                        except ArticleVariant.DoesNotExist:
                            pass
                    
                    ReclamationArticle.objects.create(
                        reclamation=reclamation,
                        article=article,
                        variant=variant,
                        quantite=quantite
                    )
                except Article.DoesNotExist:
                    continue
        
        return reclamation

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        phone = request.data.get('phone')
        user_type = request.data.get('user_type', '')
        est_membre = request.data.get('est_membre', '')
        preuve_justification = request.data.get('preuve_justification', '')
        
        if not username or not password or not email or not phone:
            return Response({'error': 'Les champs nom d\'utilisateur, mot de passe, email et téléphone sont obligatoires.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Si le type d'utilisateur est "commercial" ou "qualite", les champs est_membre et preuve_justification sont obligatoires
        if user_type in ['commercial', 'qualite']:
            if not est_membre or not preuve_justification:
                return Response({'error': 'Pour les types "Commercial" et "Agent Qualité", les champs "Êtes-vous membre de cette société ?" et "Preuve ou justification" sont obligatoires.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Ce nom d\'utilisateur existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, email=email)
        UserProfile.objects.create(
            user=user, 
            phone=phone,
            user_type=user_type if user_type else None,
            est_membre=est_membre if est_membre else None,
            preuve_justification=preuve_justification if preuve_justification else None,
            approval_status='pending'
        )
        return Response({'message': 'Inscription réussie ! Votre compte est en attente d\'approbation par l\'administrateur.'}, status=status.HTTP_201_CREATED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': profile.phone if profile else '',
            'user_type': profile.user_type if profile else '',
            'est_membre': profile.est_membre if profile else '',
            'preuve_justification': profile.preuve_justification if profile else '',
            'approval_status': profile.approval_status if profile else 'pending',
            'admin_comment': profile.admin_comment if profile else '',
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'is_superuser': user.is_superuser,
            'date_joined': user.date_joined
        })

    def patch(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        email = request.data.get('email')
        phone = request.data.get('phone')
        user_type = request.data.get('user_type')
        est_membre = request.data.get('est_membre')
        preuve_justification = request.data.get('preuve_justification')
        updated = False
        
        if email is not None:
            user.email = email
            user.save()
            updated = True
        if phone is not None and profile:
            profile.phone = phone
            updated = True
        if user_type is not None and profile:
            profile.user_type = user_type
            updated = True
        if est_membre is not None and profile:
            profile.est_membre = est_membre
            updated = True
        if preuve_justification is not None and profile:
            profile.preuve_justification = preuve_justification
            updated = True
            
        if updated and profile:
            profile.save()
            return Response({'message': 'Profil mis à jour avec succès.'})
        return Response({'error': 'Aucune donnée à mettre à jour.'}, status=400)

class ReclamationView(APIView):
    permission_classes = [IsAuthenticated]  # Nécessite une authentification

    def get(self, request):
        """Récupérer toutes les réclamations de l'utilisateur connecté"""
        reclamations = Reclamation.objects.filter(user=request.user)
        serializer = ReclamationSerializer(reclamations, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Créer une nouvelle réclamation pour l'utilisateur connecté"""
        # Vérifier si l'utilisateur est approuvé
        profile = getattr(request.user, 'profile', None)
        if not profile or profile.approval_status != 'approved':
            user_type = profile.user_type if profile else 'client'
            if user_type == 'client':
                message = "Vous n'avez pas été sélectionné par l'administrateur pour créer des réclamations, vous devez attendre."
            elif user_type == 'commercial':
                message = "Vous n'avez pas été sélectionné par l'administrateur pour devenir un commercial, vous devez attendre."
            elif user_type == 'qualite':
                message = "Vous n'avez pas été sélectionné par l'administrateur pour devenir agent qualité, vous devez attendre."
            else:
                message = "Votre compte n'a pas encore été approuvé par l'administrateur."
            
            return Response({'error': message}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ReclamationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReclamationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Récupérer une réclamation spécifique"""
        try:
            reclamation = Reclamation.objects.prefetch_related(
                'reclamationarticle_set__article',
                'reclamationarticle_set__variant',
                'photos'
            ).get(pk=pk, user=request.user)
            serializer = ReclamationSerializer(reclamation, context={'request': request})
            return Response(serializer.data)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Mettre à jour une réclamation"""
        try:
            reclamation = Reclamation.objects.get(pk=pk, user=request.user)
            serializer = ReclamationSerializer(reclamation, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Supprimer une réclamation (annulation)"""
        try:
            reclamation = Reclamation.objects.get(pk=pk, user=request.user)
            
            # Vérifier si la réclamation peut être annulée (pas encore résolue ou rejetée)
            if reclamation.statut in ['resolu', 'rejete']:
                return Response({
                    'error': 'Impossible d\'annuler une réclamation déjà résolue ou rejetée'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Supprimer la réclamation
            reclamation.delete()
            return Response({
                'message': 'Réclamation annulée avec succès'
            }, status=status.HTTP_200_OK)
            
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)


class ReclamationDetailsForApprovedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Récupérer une réclamation spécifique pour les utilisateurs approuvés (commerciaux et agents qualité)"""
        try:
            # Vérifier si l'utilisateur est approuvé
            profile = getattr(request.user, 'profile', None)
            if not profile or profile.approval_status != 'approved':
                return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
            
            reclamation = Reclamation.objects.prefetch_related(
                'reclamationarticle_set__article',
                'reclamationarticle_set__variant',
                'photos'
            ).get(pk=pk)
            serializer = ReclamationSerializer(reclamation, context={'request': request})
            return Response(serializer.data)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)


class ArticleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer les articles, optionnellement filtrés par société"""
        societe = request.query_params.get('societe', None)
        
        if societe:
            articles = Article.objects.filter(societe=societe)
        else:
            articles = Article.objects.all()
        
        serializer = ArticleSerializer(articles, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Créer un nouvel article (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ArticleSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return None

    def get(self, request, pk):
        """Récupérer un article spécifique"""
        article = self.get_object(pk)
        if not article:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ArticleSerializer(article, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        """Mettre à jour un article (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        article = self.get_object(pk)
        if not article:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ArticleSerializer(article, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Supprimer un article (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        article = self.get_object(pk)
        if not article:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        article.delete()
        return Response({'message': 'Article supprimé avec succès'}, status=status.HTTP_200_OK)

class ArticleVariantView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        """Créer une nouvelle variante pour un article (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            article = Article.objects.get(pk=article_id)
        except Article.DoesNotExist:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['article'] = article_id
        
        serializer = ArticleVariantSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleVariantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return ArticleVariant.objects.get(pk=pk)
        except ArticleVariant.DoesNotExist:
            return None

    def put(self, request, pk):
        """Mettre à jour une variante (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        variant = self.get_object(pk)
        if not variant:
            return Response({'error': 'Variante non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ArticleVariantSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Supprimer une variante (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        variant = self.get_object(pk)
        if not variant:
            return Response({'error': 'Variante non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        variant.delete()
        return Response({'message': 'Variante supprimée avec succès'}, status=status.HTTP_200_OK)

class TypeReclamationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Récupérer la liste des types de réclamation disponibles"""
        types = [
            {'value': choice[0], 'label': choice[1]} 
            for choice in Reclamation.TYPE_CHOICES
        ]
        return Response(types)


class PhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, reclamation_id):
        """Uploader des photos pour une réclamation"""
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id, user=request.user)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        photos = request.FILES.getlist('photos')
        if not photos:
            return Response({'error': 'Aucune photo fournie'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_photos = []
        for photo_file in photos:
            # Déterminer le type de fichier
            if photo_file.content_type.startswith('image/'):
                type_fichier = 'image'
            elif photo_file.content_type.startswith('video/'):
                type_fichier = 'video'
            else:
                continue  # Ignorer les fichiers non supportés

            # Créer l'objet Photo
            photo = Photo.objects.create(
                reclamation=reclamation,
                client_id=str(request.user.id),
                client_name=request.user.username,
                piece_jointe=photo_file,
                nom_fichier=photo_file.name,
                type_fichier=type_fichier,
                taille_fichier=photo_file.size
            )
            uploaded_photos.append(photo)

        # Sérialiser les photos uploadées
        serializer = PhotoSerializer(uploaded_photos, many=True, context={'request': request})
        
        return Response({
            'message': f'{len(uploaded_photos)} photo(s) uploadée(s) avec succès',
            'photos': serializer.data
        }, status=status.HTTP_201_CREATED)

    def get(self, request, reclamation_id):
        """Récupérer les photos d'une réclamation"""
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id, user=request.user)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        photos = Photo.objects.filter(reclamation=reclamation)
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, reclamation_id, photo_id):
        """Supprimer une photo spécifique"""
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id, user=request.user)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        try:
            photo = Photo.objects.get(pk=photo_id, reclamation=reclamation)
        except Photo.DoesNotExist:
            return Response({'error': 'Photo non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        photo.delete()
        return Response({'message': 'Photo supprimée avec succès'}, status=status.HTTP_200_OK)

# Vues pour la gestion administrative
class AdminUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer tous les utilisateurs (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        user_data = []
        for user in users:
            profile = getattr(user, 'profile', None)
            # Déterminer le rôle basé sur le profil utilisateur
            if user.is_superuser:
                role = 'admin'
            elif profile and profile.user_type:
                role = profile.user_type
            elif user.is_staff:
                role = 'commercial'  # Fallback pour les anciens utilisateurs
            else:
                role = 'client'
                
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'phone': profile.phone if profile else '',
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined,
                'role': role
            })
        return Response(user_data)

    def post(self, request):
        """Créer un nouvel utilisateur (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role', 'client')
        is_active = request.data.get('is_active', True)
        
        if not username or not password or not email:
            return Response({'error': 'Username, password et email sont obligatoires'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Ce nom d\'utilisateur existe déjà'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer l'utilisateur
        user = User.objects.create_user(
            username=username, 
            password=password, 
            email=email,
            is_active=is_active
        )
        
        # Définir les permissions selon le rôle
        if role == 'admin':
            user.is_superuser = True
            user.is_staff = True
        elif role == 'commercial':
            user.is_staff = False  # Les commerciaux ne sont pas automatiquement staff
            user.is_superuser = False
        elif role == 'qualite':
            user.is_staff = False  # Les agents qualité n'ont pas besoin d'être staff
            user.is_superuser = False
        else:  # client
            user.is_staff = False
            user.is_superuser = False
        
        user.save()
        
        # Créer le profil avec le bon type d'utilisateur
        if not hasattr(user, 'profile'):
            UserProfile.objects.create(
                user=user, 
                phone='',
                user_type=role if role in ['commercial', 'qualite', 'client'] else None
            )
        else:
            # Mettre à jour le type d'utilisateur dans le profil
            user.profile.user_type = role if role in ['commercial', 'qualite', 'client'] else None
            user.profile.save()
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'role': role
        }, status=status.HTTP_201_CREATED)

class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Récupérer un utilisateur spécifique (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            profile = getattr(user, 'profile', None)
            
            # Déterminer le rôle basé sur le profil utilisateur
            if user.is_superuser:
                role = 'admin'
            elif profile and profile.user_type:
                role = profile.user_type
            elif user.is_staff:
                role = 'commercial'  # Fallback pour les anciens utilisateurs
            else:
                role = 'client'
                
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'phone': profile.phone if profile else '',
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined,
                'role': role
            })
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Mettre à jour un utilisateur (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            
            # Mettre à jour les champs de base
            if 'username' in request.data:
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            if 'is_active' in request.data:
                user.is_active = request.data['is_active']
            if 'is_staff' in request.data:
                user.is_staff = request.data['is_staff']
            
            # Mettre à jour le rôle
            if 'role' in request.data:
                role = request.data['role']
                if role == 'admin':
                    user.is_superuser = True
                    user.is_staff = True
                elif role == 'commercial':
                    user.is_staff = False  # Les commerciaux ne sont pas automatiquement staff
                    user.is_superuser = False
                elif role == 'qualite':
                    user.is_staff = False  # Les agents qualité n'ont pas besoin d'être staff
                    user.is_superuser = False
                else:  # client
                    user.is_staff = False
                    user.is_superuser = False
                
                # Mettre à jour le profil utilisateur avec le bon type
                if hasattr(user, 'profile'):
                    user.profile.user_type = role if role in ['commercial', 'qualite', 'client'] else None
                    user.profile.save()
                else:
                    # Créer le profil si il n'existe pas
                    UserProfile.objects.create(
                        user=user,
                        phone='',
                        user_type=role if role in ['commercial', 'qualite', 'client'] else None
                    )
            
            # Si is_staff est modifié manuellement, ne pas changer automatiquement le rôle
            # Laissez l'administrateur gérer manuellement les permissions
            pass
            
            # Mettre à jour le mot de passe si fourni
            if 'password' in request.data and request.data['password']:
                user.set_password(request.data['password'])
            
            user.save()
            
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'role': role
            })
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Supprimer un utilisateur (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({'message': 'Utilisateur supprimé avec succès'})
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class AdminCompanyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer toutes les sociétés (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        # Pour l'instant, retourner les sociétés hardcodées
        companies = [
            {'id': 1, 'name': 'Vetadis', 'code': 'VIT', 'description': 'Société Vetadis', 'is_active': True},
            {'id': 2, 'name': 'Kenz Maroc', 'code': 'KENZ', 'description': 'Société Kenz Maroc', 'is_active': True},
            {'id': 3, 'name': 'KenzPat', 'code': 'KENZPAT', 'description': 'Société KenzPat', 'is_active': True}
        ]
        return Response(companies)

    def post(self, request):
        """Créer une nouvelle société (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name')
        code = request.data.get('code')
        description = request.data.get('description', '')
        is_active = request.data.get('is_active', True)
        
        if not name or not code:
            return Response({'error': 'Nom et code sont obligatoires'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Pour l'instant, simuler la création
        new_company = {
            'id': 4,  # Simuler un nouvel ID
            'name': name,
            'code': code,
            'description': description,
            'is_active': is_active
        }
        
        return Response(new_company, status=status.HTTP_201_CREATED)

class AdminCompanyDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Récupérer une société spécifique (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        companies = {
            1: {'id': 1, 'name': 'Vetadis', 'code': 'VIT', 'description': 'Société Vetadis', 'is_active': True},
            2: {'id': 2, 'name': 'Kenz Maroc', 'code': 'KENZ', 'description': 'Société Kenz Maroc', 'is_active': True},
            3: {'id': 3, 'name': 'KenzPat', 'code': 'KENZPAT', 'description': 'Société KenzPat', 'is_active': True}
        }
        
        if pk in companies:
            return Response(companies[pk])
        return Response({'error': 'Société non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Mettre à jour une société (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        companies = {
            1: {'id': 1, 'name': 'Vetadis', 'code': 'VIT', 'description': 'Société Vetadis', 'is_active': True},
            2: {'id': 2, 'name': 'Kenz Maroc', 'code': 'KENZ', 'description': 'Société Kenz Maroc', 'is_active': True},
            3: {'id': 3, 'name': 'KenzPat', 'code': 'KENZPAT', 'description': 'Société KenzPat', 'is_active': True}
        }
        
        if pk in companies:
            company = companies[pk].copy()
            company.update(request.data)
            company['id'] = pk
            return Response(company)
        return Response({'error': 'Société non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Supprimer une société (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        companies = [1, 2, 3]  # IDs des sociétés existantes
        
        if pk in companies:
            return Response({'message': 'Société supprimée avec succès'})
        return Response({'error': 'Société non trouvée'}, status=status.HTTP_404_NOT_FOUND)



class SimpleRequestSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SimpleRequest
        fields = ['id', 'user_username', 'type_demande', 'est_membre', 'preuve_justification', 'status', 'created_at', 'admin_comment']
        read_only_fields = ['id', 'user_username', 'status', 'created_at']

class SimpleRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer toutes les demandes simples (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        requests = SimpleRequest.objects.all()
        serializer = SimpleRequestSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Créer une nouvelle demande simple"""
        serializer = SimpleRequestSerializer(data=request.data)
        if serializer.is_valid():
            # Associer l'utilisateur connecté à la demande
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SimpleRequestDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Récupérer une demande simple spécifique (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            simple_request = SimpleRequest.objects.get(pk=pk)
            serializer = SimpleRequestSerializer(simple_request)
            return Response(serializer.data)
        except SimpleRequest.DoesNotExist:
            return Response({'error': 'Demande non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Mettre à jour le statut d'une demande simple (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            simple_request = SimpleRequest.objects.get(pk=pk)
        except SimpleRequest.DoesNotExist:
            return Response({'error': 'Demande non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('status')
        admin_comment = request.data.get('admin_comment', '')
        
        if new_status in ['pending', 'approved', 'rejected']:
            simple_request.status = new_status
            if admin_comment:
                simple_request.admin_comment = admin_comment
            simple_request.save()
            
            # Si la demande est approuvée et que c'est pour devenir Commercial
            if new_status == 'approved' and simple_request.type_demande == 'commercial':
                # Créer un message de confirmation
                confirmation_message = f"Félicitations ! Votre demande pour devenir Commercial a été approuvée. Vous pouvez maintenant accéder à toutes les réclamations et les gérer."
                
                return Response({
                    'message': f'Statut mis à jour vers {new_status}',
                    'confirmation_message': confirmation_message,
                    'user_upgraded': True
                })
            
            return Response({'message': f'Statut mis à jour vers {new_status}'})
        else:
            return Response({'error': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Supprimer une demande simple (admin seulement)"""
        if not request.user.is_staff:
            return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            simple_request = SimpleRequest.objects.get(pk=pk)
            simple_request.delete()
            return Response({'message': 'Demande supprimée avec succès'})
        except SimpleRequest.DoesNotExist:
            return Response({'error': 'Demande non trouvée'}, status=status.HTTP_404_NOT_FOUND)

class AllReclamationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer toutes les réclamations (pour utilisateurs approuvés)"""
        # Récupérer toutes les réclamations
        reclamations = Reclamation.objects.all()
        serializer = ReclamationSerializer(reclamations, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        """Mettre à jour le statut d'une réclamation (pour utilisateurs approuvés)"""
        try:
            reclamation = Reclamation.objects.get(pk=pk)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('statut')
        if new_status in ['en_attente', 'en_traitement_qualite', 'resolu', 'rejete']:
            if new_status == 'rejete':
                # Supprimer automatiquement la réclamation si elle est rejetée
                reclamation.delete()
                return Response({'message': 'Réclamation rejetée et supprimée'})
            else:
                # Mettre à jour le statut pour les autres cas
                reclamation.statut = new_status
                reclamation.save()
                return Response({'message': f'Statut mis à jour vers {new_status}'})
        else:
            return Response({'error': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)

class CommercialStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Vérifier si l'utilisateur a une demande Commercial approuvée"""
        # Vérifier d'abord le profil utilisateur
        profile = getattr(request.user, 'profile', None)
        if profile and profile.user_type == 'commercial' and profile.approval_status == 'approved':
            return Response({
                'has_approved_commercial_request': True,
                'request_id': None,
                'approved_date': profile.created_at if hasattr(profile, 'created_at') else None,
                'source': 'profile'
            })
        
        # Vérifier ensuite s'il y a une SimpleRequest approuvée
        try:
            approved_request = SimpleRequest.objects.get(
                user=request.user,
                type_demande='commercial',
                status='approved'
            )
            return Response({
                'has_approved_commercial_request': True,
                'request_id': approved_request.id,
                'approved_date': approved_request.created_at,
                'source': 'simple_request'
            })
        except SimpleRequest.DoesNotExist:
            return Response({
                'has_approved_commercial_request': False
            })

class QualityAgentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer les réclamations en cours pour les agents qualité"""
        # Vérifier si l'utilisateur est un agent qualité approuvé
        profile = getattr(request.user, 'profile', None)
        if not profile or profile.user_type != 'qualite' or profile.approval_status != 'approved':
            return Response({'error': 'Accès refusé. Vous devez être un agent qualité approuvé.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Récupérer seulement les réclamations avec le statut "en_traitement_qualite"
        reclamations = Reclamation.objects.filter(statut='en_traitement_qualite')
        serializer = ReclamationSerializer(reclamations, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        """Mettre à jour le statut d'une réclamation (pour agents qualité)"""
        # Vérifier si l'utilisateur est un agent qualité approuvé
        profile = getattr(request.user, 'profile', None)
        if not profile or profile.user_type != 'qualite' or profile.approval_status != 'approved':
            return Response({'error': 'Accès refusé. Vous devez être un agent qualité approuvé.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            reclamation = Reclamation.objects.get(pk=pk, statut='en_traitement_qualite')
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée ou non en traitement par agent qualité'}, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('statut')
        if new_status in ['en_traitement_qualite', 'resolu', 'rejete']:
            if new_status == 'en_traitement_qualite':
                old_status = reclamation.statut
                reclamation.statut = new_status
                reclamation.save()
                
                # Créer une notification pour le client
                status_messages = {
                    'en_traitement_qualite': 'Votre réclamation est maintenant en cours de traitement par notre équipe qualité.',
                    'resolu': 'Votre réclamation a été résolue avec succès.',
                    'rejete': 'Votre réclamation a été rejetée après examen.'
                }
                
                create_notification(
                    user=reclamation.user,
                    reclamation=reclamation,
                    title=f"Mise à jour de votre réclamation #{reclamation.id}",
                    message=status_messages.get(new_status, f"Le statut de votre réclamation a été mis à jour vers: {new_status}")
                )
                
                return Response({'message': f'Statut mis à jour vers {new_status}'})
            else:
                reclamation.statut = new_status
                reclamation.save()
                
                # Créer une notification pour le client
                status_messages = {
                    'resolu': 'Bonne nouvelle ! Votre réclamation a été résolue avec succès par notre équipe qualité.',
                    'rejete': 'Après examen approfondi, votre réclamation a été rejetée. Contactez-nous pour plus d\'informations.'
                }
                
                create_notification(
                    user=reclamation.user,
                    reclamation=reclamation,
                    title=f"Décision finale pour votre réclamation #{reclamation.id}",
                    message=status_messages.get(new_status, f"Le statut de votre réclamation a été mis à jour vers: {new_status}")
                )
                
                return Response({'message': f'Statut mis à jour vers {new_status}'})
        else:
            return Response({'error': 'Statut invalide. Les agents qualité peuvent seulement marquer comme résolu ou rejeté.'}, status=status.HTTP_400_BAD_REQUEST)

class PendingRegistrationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer toutes les inscriptions en attente d'approbation"""
        if not request.user.is_staff:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        pending_profiles = UserProfile.objects.filter(approval_status='pending').select_related('user')
        registrations = []
        
        for profile in pending_profiles:
            registrations.append({
                'id': profile.id,
                'user_id': profile.user.id,
                'username': profile.user.username,
                'email': profile.user.email,
                'phone': profile.phone,
                'user_type': profile.user_type,
                'est_membre': profile.est_membre,
                'preuve_justification': profile.preuve_justification,
                'date_joined': profile.user.date_joined,
                'approval_status': profile.approval_status
            })
        
        return Response(registrations)

    def put(self, request, pk):
        """Approuver ou rejeter une inscription"""
        if not request.user.is_staff:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = UserProfile.objects.get(pk=pk)
            action = request.data.get('action')  # 'approve' ou 'reject'
            comment = request.data.get('comment', '')
            
            if action == 'approve':
                profile.approval_status = 'approved'
                profile.admin_comment = comment
                profile.save()
                return Response({'message': 'Inscription approuvée avec succès'})
            elif action == 'reject':
                profile.approval_status = 'rejected'
                profile.admin_comment = comment
                profile.save()
                return Response({'message': 'Inscription rejetée'})
            else:
                return Response({'error': 'Action invalide'}, status=status.HTTP_400_BAD_REQUEST)
                
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profil non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class ArticleVariantView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, article_id):
        """Récupérer les variantes d'un article"""
        try:
            article = Article.objects.get(pk=article_id)
            variants = ArticleVariant.objects.filter(article=article)
            serializer = ArticleVariantSerializer(variants, many=True)
            return Response(serializer.data)
        except Article.DoesNotExist:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, article_id):
        """Créer une nouvelle variante pour un article"""
        if not request.user.is_staff:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            article = Article.objects.get(pk=article_id)
            data = request.data.copy()
            data['article'] = article.id
            
            serializer = ArticleVariantSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Article.DoesNotExist:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class ArticleVariantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Récupérer une variante spécifique"""
        try:
            variant = ArticleVariant.objects.get(pk=pk)
            serializer = ArticleVariantSerializer(variant)
            return Response(serializer.data)
        except ArticleVariant.DoesNotExist:
            return Response({'error': 'Variante non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Mettre à jour une variante"""
        if not request.user.is_staff:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            variant = ArticleVariant.objects.get(pk=pk)
            serializer = ArticleVariantSerializer(variant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ArticleVariant.DoesNotExist:
            return Response({'error': 'Variante non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Supprimer une variante"""
        if not request.user.is_staff:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            variant = ArticleVariant.objects.get(pk=pk)
            variant.delete()
            return Response({'message': 'Variante supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
        except ArticleVariant.DoesNotExist:
            return Response({'error': 'Variante non trouvée'}, status=status.HTTP_404_NOT_FOUND)

class NotificationSerializer(serializers.ModelSerializer):
    reclamation_title = serializers.CharField(source='reclamation.titre', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'message', 'is_read', 'created_at', 'reclamation', 'reclamation_title']
        read_only_fields = ['id', 'created_at', 'reclamation_title']

class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer les notifications de l'utilisateur connecté"""
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        """Marquer une notification comme lue"""
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marquée comme lue'})
        except Notification.DoesNotExist:
            return Response({'error': 'Notification non trouvée'}, status=status.HTTP_404_NOT_FOUND)


class ReportSerializer(serializers.ModelSerializer):
    reclamation_title = serializers.CharField(source='reclamation.titre', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'reclamation', 'reclamation_title', 'responsable', 'date_rapport', 'objet',
            'description_probleme', 'actions', 'resultat', 'conclusion', 'recommandation', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'reclamation_title']
        extra_kwargs = {
            'description_probleme': { 'required': False, 'allow_blank': True },
            'actions': { 'required': False, 'allow_blank': True },
            'conclusion': { 'required': False, 'allow_blank': True },
            'recommandation': { 'required': False, 'allow_blank': True },
        }

    def create(self, validated_data):
        if not validated_data.get('responsable') and self.context.get('request'):
            validated_data['responsable'] = self.context['request'].user.username
        return super().create(validated_data)


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reclamation_id):
        """Lister les rapports d'une réclamation"""
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        reports = Report.objects.filter(reclamation=reclamation)
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)

    def post(self, request, reclamation_id):
        """Créer un rapport pour une réclamation"""
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['reclamation'] = reclamation.id
        serializer = ReportSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReclamationMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = ReclamationMessage
        fields = ['id', 'reclamation', 'sender', 'sender_username', 'content', 'created_at']
        read_only_fields = ['id', 'created_at', 'sender', 'sender_username']


class ReclamationMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reclamation_id):
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        messages = ReclamationMessage.objects.filter(reclamation=reclamation).select_related('sender').order_by('created_at')
        serializer = ReclamationMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, reclamation_id):
        try:
            reclamation = Reclamation.objects.get(pk=reclamation_id)
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'Message vide'}, status=status.HTTP_400_BAD_REQUEST)

        message = ReclamationMessage.objects.create(
            reclamation=reclamation,
            sender=request.user,
            content=content
        )
        serializer = ReclamationMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        """Supprimer une notification"""
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.delete()
            return Response({'message': 'Notification supprimée'}, status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification non trouvée'}, status=status.HTTP_404_NOT_FOUND)


class TestReclamationArticlesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Vue de test pour vérifier les articles d'une réclamation"""
        try:
            reclamation = Reclamation.objects.get(pk=pk)
            
            # Récupérer directement les articles de réclamation
            reclamation_articles = ReclamationArticle.objects.filter(reclamation=reclamation)
            
            # Informations de débogage
            debug_info = {
                'reclamation_id': reclamation.id,
                'reclamation_titre': reclamation.titre,
                'articles_count': reclamation_articles.count(),
                'articles_details': []
            }
            
            for ra in reclamation_articles:
                debug_info['articles_details'].append({
                    'id': ra.id,
                    'article_id': ra.article.id if ra.article else None,
                    'article_nom': ra.article.nom if ra.article else None,
                    'quantite': ra.quantite,
                    'variant_id': ra.variant.id if ra.variant else None,
                    'variant_weight': ra.variant.weight if ra.variant else None,
                })
            
            # Serializer normal
            serializer = ReclamationSerializer(reclamation, context={'request': request})
            
            return Response({
                'debug_info': debug_info,
                'serializer_data': serializer.data
            })
            
        except Reclamation.DoesNotExist:
            return Response({'error': 'Réclamation non trouvée'}, status=status.HTTP_404_NOT_FOUND)