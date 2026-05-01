from django.contrib import admin
from .models import UserProfile, Reclamation, SimpleRequest, Photo, Article, ReclamationArticle, ArticleVariant, Notification, ReclamationMessage, Report

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'user_type', 'approval_status', 'est_membre', 'date_joined')
    list_filter = ('user_type', 'approval_status', 'est_membre', 'user__is_active', 'user__date_joined')
    search_fields = ('user__username', 'user__email', 'phone', 'preuve_justification')
    list_editable = ('approval_status',)
    list_per_page = 25
    actions = ['approve_profiles', 'reject_profiles', 'mark_as_commercial', 'mark_as_quality_agent']
    readonly_fields = ('date_joined',)
    
    fieldsets = (
        ('Informations utilisateur', {
            'fields': ('user', 'phone', 'date_joined')
        }),
        ('Type et statut', {
            'fields': ('user_type', 'approval_status')
        }),
        ('Informations supplémentaires', {
            'fields': ('est_membre', 'preuve_justification')
        }),
        ('Commentaires administrateur', {
            'fields': ('admin_comment',),
            'classes': ('collapse',)
        }),
    )
    
    def date_joined(self, obj):
        return obj.user.date_joined.strftime('%d/%m/%Y %H:%M')
    date_joined.short_description = 'Date d\'inscription'
    
    def approve_profiles(self, request, queryset):
        updated = queryset.update(approval_status='approved')
        self.message_user(request, f'{updated} profil(s) approuvé(s) avec succès.')
    approve_profiles.short_description = "✅ Approuver les profils sélectionnés"
    
    def reject_profiles(self, request, queryset):
        updated = queryset.update(approval_status='rejected')
        self.message_user(request, f'{updated} profil(s) rejeté(s) avec succès.')
    reject_profiles.short_description = "❌ Rejeter les profils sélectionnés"
    
    def mark_as_commercial(self, request, queryset):
        updated = queryset.update(user_type='commercial')
        self.message_user(request, f'{updated} profil(s) marqué(s) comme Commercial.')
    mark_as_commercial.short_description = "🏢 Marquer comme Commercial"
    
    def mark_as_quality_agent(self, request, queryset):
        updated = queryset.update(user_type='qualite')
        self.message_user(request, f'{updated} profil(s) marqué(s) comme Agent Qualité.')
    mark_as_quality_agent.short_description = "🔍 Marquer comme Agent Qualité"

class ReclamationArticleInline(admin.TabularInline):
    model = ReclamationArticle
    extra = 0
    readonly_fields = ('article_image_display', 'article_info_display')
    fields = ('article', 'variant', 'quantite', 'article_image_display', 'article_info_display')
    
    def article_image_display(self, obj):
        if obj.article and obj.article.image:
            try:
                image_url = obj.article.image.url
                return f'<img src="{image_url}" style="max-width: 80px; max-height: 80px; border-radius: 5px; border: 1px solid #ddd;" alt="{obj.article.nom}" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';" /><span style="display:none; color:red; font-size:10px;">Erreur image</span>'
            except Exception as e:
                return f"Image: {obj.article.image.name} (Erreur: {str(e)})"
        return "Aucune image"
    article_image_display.allow_html = True
    article_image_display.short_description = 'Image'
    
    def article_info_display(self, obj):
        if obj.article:
            info = f"<strong>{obj.article.nom}</strong><br>"
            info += f"Société: {obj.article.get_societe_display()}<br>"
            if obj.variant:
                info += f"Variante: {obj.variant.weight}<br>"
            info += f"Quantité: {obj.quantite}<br>"
            if obj.article.image:
                try:
                    info += f"<small>Image: {obj.article.image.name} - URL: {obj.article.image.url}</small>"
                except:
                    info += f"<small>Image: {obj.article.image.name} (Erreur URL)</small>"
            else:
                info += "<small>Aucune image</small>"
            return info
        return "Article non défini"
    article_info_display.allow_html = True
    article_info_display.short_description = 'Informations'

@admin.register(Reclamation)
class ReclamationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'user', 'type_reclamation', 'statut', 'date_creation', 'articles_count')
    list_filter = ('type_reclamation', 'statut', 'date_creation')
    search_fields = ('titre', 'description', 'user__username')
    readonly_fields = ('date_creation',)
    list_per_page = 20
    inlines = [ReclamationArticleInline]
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('user', 'titre', 'type_reclamation')
        }),
        ('Détails', {
            'fields': ('description', 'statut')
        }),
        ('Articles concernés', {
            'fields': (),
            'classes': ('collapse',)
        }),
        ('Informations système', {
            'fields': ('date_creation',),
            'classes': ('collapse',)
        }),
    )
    
    def articles_count(self, obj):
        return obj.articles.count()
    articles_count.short_description = 'Articles'


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_name', 'reclamation', 'type_fichier', 'nom_fichier', 'taille_formattee', 'date_upload')
    list_filter = ('type_fichier', 'date_upload', 'reclamation__statut')
    search_fields = ('client_name', 'nom_fichier', 'description', 'reclamation__titre')
    readonly_fields = ('date_upload', 'taille_formattee', 'file_url')
    list_per_page = 25
    actions = ['delete_selected_photos']

    fieldsets = (
        ('Informations de la réclamation', {
            'fields': ('reclamation', 'client_id', 'client_name')
        }),
        ('Fichier', {
            'fields': ('piece_jointe', 'nom_fichier', 'type_fichier', 'taille_fichier')
        }),
        ('Métadonnées', {
            'fields': ('description', 'date_upload', 'taille_formattee', 'file_url'),
            'classes': ('collapse',)
        }),
    )

    def taille_formattee(self, obj):
        return obj.get_taille_formattee()
    taille_formattee.short_description = 'Taille formatée'

    def file_url(self, obj):
        if obj.piece_jointe:
            return f"<a href='{obj.piece_jointe.url}' target='_blank'>Voir le fichier</a>"
        return "Aucun fichier"
    file_url.allow_tags = True
    file_url.short_description = 'Lien vers le fichier'

    def delete_selected_photos(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} photo(s) supprimée(s) avec succès.')
    delete_selected_photos.short_description = "🗑️ Supprimer les photos sélectionnées"


class ArticleVariantInline(admin.TabularInline):
    model = ArticleVariant
    extra = 0
    fields = ('weight', 'price', 'is_available')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('nom', 'get_societe_display', 'has_image', 'variants_count')
    list_filter = ('societe',)
    search_fields = ('nom',)
    list_per_page = 25
    inlines = [ArticleVariantInline]
    
    fields = ('nom', 'societe', 'image')
    
    def get_societe_display(self, obj):
        return obj.get_societe_display()
    get_societe_display.short_description = 'Société'
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Image'
    
    def variants_count(self, obj):
        return obj.variants.count()
    variants_count.short_description = 'Variantes'

@admin.register(ArticleVariant)
class ArticleVariantAdmin(admin.ModelAdmin):
    list_display = ('article', 'weight', 'price', 'is_available')
    list_filter = ('weight', 'is_available', 'article__societe')
    search_fields = ('article__nom',)
    list_editable = ('price', 'is_available')
    list_per_page = 25

@admin.register(ReclamationArticle)
class ReclamationArticleAdmin(admin.ModelAdmin):
    list_display = ('reclamation', 'article', 'variant', 'quantite')
    list_filter = ('article__societe', 'reclamation__statut', 'variant__weight')
    search_fields = ('reclamation__titre', 'article__nom')
    list_per_page = 25
    
    fieldsets = (
        ('Association réclamation-article', {
            'fields': ('reclamation', 'article', 'quantite')
        }),
    )


@admin.register(SimpleRequest)
class SimpleRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'type_demande', 'est_membre', 'status', 'created_at')
    list_filter = ('type_demande', 'est_membre', 'status', 'created_at')
    search_fields = ('preuve_justification',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 20
    
    fieldsets = (
        ('Informations de la demande', {
            'fields': ('type_demande', 'est_membre')
        }),
        ('Détails', {
            'fields': ('preuve_justification', 'status', 'admin_comment')
        }),
        ('Informations système', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'is_read', 'created_at', 'reclamation')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    list_editable = ('is_read',)
    readonly_fields = ('created_at',)
    list_per_page = 25
    ordering = ('-created_at',)


@admin.register(ReclamationMessage)
class ReclamationMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'reclamation', 'sender', 'short_content', 'created_at')
    list_filter = ('created_at', 'reclamation__statut')
    search_fields = ('content', 'sender__username', 'reclamation__titre')
    readonly_fields = ('created_at',)
    list_per_page = 50

    def short_content(self, obj):
        return (obj.content[:60] + '…') if len(obj.content) > 60 else obj.content
    short_content.short_description = 'Contenu'


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'reclamation', 'responsable', 'date_rapport', 'objet', 'created_at')
    list_filter = ('date_rapport', 'created_at', 'reclamation__statut')
    search_fields = ('objet', 'responsable', 'reclamation__titre', 'description_probleme')
    readonly_fields = ('created_at',)
    list_per_page = 25
    fieldsets = (
        ('Réclamation liée', {
            'fields': ('reclamation',)
        }),
        ('En-tête du rapport', {
            'fields': ('responsable', 'date_rapport', 'objet')
        }),
        ('Contenu', {
            'fields': ('description_probleme', 'actions', 'resultat', 'conclusion', 'recommandation')
        }),
        ('Système', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )