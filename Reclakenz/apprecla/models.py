from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class UserProfile(models.Model):
    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('commercial', 'Commercial'),
        ('qualite', 'Agent Qualité'),
    ]
    MEMBER_CHOICES = [
        ('yes', 'Oui, je suis membre'),
        ('no', 'Non, je ne suis pas membre'),
    ]
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20)
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        verbose_name="Type d'utilisateur",
        blank=True,
        null=True
    )
    est_membre = models.CharField(
        max_length=10,
        choices=MEMBER_CHOICES,
        verbose_name="Êtes-vous membre de cette société ?",
        blank=True,
        null=True
    )
    preuve_justification = models.TextField(
        verbose_name="Preuve ou justification",
        help_text="Veuillez fournir une preuve ou justification de votre statut",
        blank=True,
        null=True
    )
    approval_status = models.CharField(
        max_length=20,
        choices=APPROVAL_STATUS_CHOICES,
        default='pending',
        verbose_name="Statut d'approbation"
    )
    admin_comment = models.TextField(
        blank=True,
        null=True,
        verbose_name="Commentaire administrateur"
    )
    
    def __str__(self):
        return f"{self.user.username} - {self.phone}"

class Reclamation(models.Model):
    TYPE_CHOICES = [
        ('qualite', 'Problème de qualité'),
        ('livraison', 'Erreur de livraison'),
        ('manquant', 'Produit manquant'),
        ('quantite', 'Mauvaise quantité livrée'),
        ('commande', 'Erreur de commande'),
        ('retard', 'Retard de livraison'),
    ]
    
    SOCIETE_CHOICES = [
        ('vetadis', 'Vetadis'),
        ('kenz_maroc', 'Kenz Maroc'),
        ('kenzpat', 'KenzPat'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reclamations')
    type_reclamation = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        verbose_name="Type de réclamation"
    )
    societe = models.CharField(
        max_length=20,
        choices=SOCIETE_CHOICES,
        verbose_name="Société",
        blank=True,
        null=True
    )
    titre = models.CharField(max_length=200, verbose_name="Titre de la réclamation")
    description = models.TextField(verbose_name="Description détaillée")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    statut = models.CharField(
        max_length=25,
        choices=[
            ('en_attente', 'En attente'),
            ('en_traitement_qualite', 'En traitement par agent qualité'),
            ('resolu', 'Résolu'),
            ('rejete', 'Rejeté'),
        ],
        default='en_attente',
        verbose_name="Statut"
    )
    articles = models.ManyToManyField(
        'Article',
        through='ReclamationArticle',
        through_fields=('reclamation', 'article'),
        blank=True,
        related_name='reclamations',
        verbose_name="Articles concernés"
    )
    
    class Meta:
        verbose_name = "Réclamation"
        verbose_name_plural = "Réclamations"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.get_type_reclamation_display()} - {self.titre} ({self.user.username})"


class Photo(models.Model):
    reclamation = models.ForeignKey(Reclamation, on_delete=models.CASCADE, related_name='photos')
    client_id = models.CharField(max_length=100, verbose_name="ID du client")
    client_name = models.CharField(max_length=200, verbose_name="Nom du client")
    piece_jointe = models.FileField(
        upload_to='photos_reclamations/%Y/%m/%d/',
        verbose_name="Pièce jointe (photo/vidéo)"
    )
    nom_fichier = models.CharField(max_length=255, verbose_name="Nom du fichier")
    type_fichier = models.CharField(
        max_length=20,
        choices=[
            ('image', 'Image'),
            ('video', 'Vidéo')
        ],
        verbose_name="Type de fichier"
    )
    taille_fichier = models.BigIntegerField(verbose_name="Taille du fichier (bytes)", null=True, blank=True)
    description = models.TextField(blank=True, null=True, verbose_name="Description optionnelle")
    date_upload = models.DateTimeField(auto_now_add=True, verbose_name="Date d'upload")

    class Meta:
        verbose_name = "Photo/Vidéo de réclamation"
        verbose_name_plural = "Photos/Vidéos de réclamations"
        ordering = ['-date_upload']

    def __str__(self):
        return f"Photo {self.id} - {self.client_name} - {self.reclamation.titre}"

    def get_file_url(self):
        return self.piece_jointe.url if self.piece_jointe else None

    def get_taille_formattee(self):
        if self.taille_fichier is None:
            return "0 B"
        if self.taille_fichier < 1024:
            return f"{self.taille_fichier} B"
        elif self.taille_fichier < 1024 * 1024:
            return f"{self.taille_fichier / 1024:.1f} KB"
        else:
            return f"{self.taille_fichier / (1024 * 1024):.1f} MB"



class Article(models.Model):
    SOCIETE_CHOICES = [
        ('vetadis', 'Vetadis'),
        ('kenz_maroc', 'Kenz Maroc'),
        ('kenzpat', 'KenzPat'),
    ]
    nom = models.CharField(max_length=255, verbose_name="Nom de l'article")
    societe = models.CharField(
        max_length=20,
        choices=SOCIETE_CHOICES,
        verbose_name="Société",
        blank=True,
        null=True
    )
    image = models.ImageField(
        upload_to='articles/%Y/%m/%d/',
        verbose_name="Image de l'article",
        blank=True,
        null=True,
        help_text="Image du produit"
    )

    def __str__(self):
        return f"{self.nom} ({self.get_societe_display()})"

class ArticleVariant(models.Model):
    WEIGHT_CHOICES = [
        ('500g', '500 grammes'),
        ('1kg', '1 kilogramme'),
        ('2kg', '2 kilogrammes'),
        ('5kg', '5 kilogrammes'),
        ('10kg', '10 kilogrammes'),
        ('25kg', '25 kilogrammes'),
        ('50kg', '50 kilogrammes'),
    ]
    
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='variants')
    weight = models.CharField(max_length=10, choices=WEIGHT_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('article', 'weight')
        verbose_name = "Variante d'article"
        verbose_name_plural = "Variantes d'articles"
        ordering = ['weight']
    
    def __str__(self):
        return f"{self.article.nom} - {self.weight}"

class ReclamationArticle(models.Model):
    reclamation = models.ForeignKey(Reclamation, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    variant = models.ForeignKey(
        ArticleVariant, 
        on_delete=models.CASCADE, 
        verbose_name="Variante (poids)",
        blank=True,
        null=True
    )
    quantite = models.PositiveIntegerField(default=1, verbose_name="Quantité")

    class Meta:
        unique_together = ('reclamation', 'article', 'variant')
        verbose_name = "Article de réclamation"
        verbose_name_plural = "Articles de réclamation"

    def __str__(self):
        return f"{self.reclamation.titre} - {self.article.nom}"
    
    def get_article_image(self):
        """Retourne l'image de l'article pour cette réclamation"""
        return self.article.image if self.article.image else None
    
    @property
    def image_article(self):
        """Propriété qui retourne automatiquement l'image de l'article"""
        return self.article.image if self.article.image else None


class Notification(models.Model):
    TYPE_CHOICES = [
        ('status_change', 'Changement de statut'),
        ('info', 'Information'),
        ('warning', 'Avertissement'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    reclamation = models.ForeignKey(Reclamation, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
    
    def __str__(self):
        return f"Notification pour {self.user.username}: {self.title}"


class ReclamationMessage(models.Model):
    reclamation = models.ForeignKey(Reclamation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reclamation_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = "Message de réclamation"
        verbose_name_plural = "Messages de réclamation"

    def __str__(self):
        return f"Message #{self.id} - Reclamation {self.reclamation_id} - {self.sender.username}"


class Report(models.Model):
    """Rapport de traitement lié à une réclamation."""
    reclamation = models.ForeignKey(Reclamation, on_delete=models.CASCADE, related_name='reports')
    responsable = models.CharField(max_length=200, verbose_name="Responsable")
    date_rapport = models.DateField(verbose_name="Date du rapport")
    objet = models.CharField(max_length=255, verbose_name="Objet du rapport")
    description_probleme = models.TextField(verbose_name="Description du problème")
    actions = models.TextField(verbose_name="Actions entreprises")
    resultat = models.TextField(verbose_name="Résultat")
    conclusion = models.TextField(verbose_name="Conclusion")
    recommandation = models.TextField(verbose_name="Recommandation", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Rapport"
        verbose_name_plural = "Rapports"
        ordering = ['-created_at']

    def __str__(self):
        return f"Rapport {self.id} - Réclamation {self.reclamation_id}"
class SimpleRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
    ]
    MEMBER_CHOICES = [
        ('yes', 'Oui, je suis membre'),
        ('no', 'Non, je ne suis pas membre'),
    ]
    TYPE_DEMANDE_CHOICES = [
        ('commercial', 'Commercial'),
        ('qualite', 'Agent Qualité'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Utilisateur")
    type_demande = models.CharField(
        max_length=20,
        choices=TYPE_DEMANDE_CHOICES,
        verbose_name="Type de demande"
    )
    est_membre = models.CharField(
        max_length=10,
        choices=MEMBER_CHOICES,
        verbose_name="Êtes-vous membre de cette société ?"
    )
    preuve_justification = models.TextField(
        verbose_name="Preuve ou justification",
        help_text="Veuillez fournir une preuve ou justification de votre statut"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Statut"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    admin_comment = models.TextField(blank=True, null=True, verbose_name="Commentaire administrateur")

    class Meta:
        verbose_name = "Demande simple"
        verbose_name_plural = "Demandes simples"
        ordering = ['-created_at']

    def __str__(self):
        return f"Demande {self.id} - {self.user.username} - {self.get_type_demande_display()} - {self.get_status_display()}"
