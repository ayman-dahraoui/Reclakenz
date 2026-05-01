from django.core.management.base import BaseCommand
from apprecla.models import Article

class Command(BaseCommand):
    help = 'Create sample articles for testing'

    def handle(self, *args, **options):
        # Articles pour KenzPat avec images
        kenzpat_articles = [
            {
                'nom': 'Semoule Grosse Premium Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1669/1669_1.jpg'
            },
            {
                'nom': 'Semoule Fine Premium Kenz', 
                'image': 'https://e-xportmorocco.com/uploads/products/1670/1670_1.jpg'
            },
            {
                'nom': 'Semoule finot Premium Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1671/1671_1.jpg'
            },
            {
                'nom': 'Semoule complète Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1672/1672_1.jpg'
            },
            {
                'nom': 'Couscous Grain Moyen Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1673/1673_1.jpg'
            },
            {
                'nom': 'Couscous Grain Fin Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1674/1674_1.jpg'
            },
            {
                'nom': 'Farine de Blé T55 Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1675/1675_1.jpg'
            },
            {
                'nom': 'Petit plomb pates Kenz',
                'image': 'https://e-xportmorocco.com/uploads/products/1676/1676_1.jpg'
            },
        ]

        # Articles pour Kenz Maroc avec images
        kenz_maroc_articles = [
            {
                'nom': 'Couscous Traditionnel Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1677/1677_1.jpg'
            },
            {
                'nom': 'Couscous Bio Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1678/1678_1.jpg'
            },
            {
                'nom': 'Farine Complète Bio Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1679/1679_1.jpg'
            },
            {
                'nom': 'Semoule de Blé Dur Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1680/1680_1.jpg'
            },
            {
                'nom': 'Couscous Perlé Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1681/1681_1.jpg'
            },
            {
                'nom': 'Farine de Sarrasin Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1682/1682_1.jpg'
            },
            {
                'nom': 'Semoule Extra Fine Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1683/1683_1.jpg'
            },
            {
                'nom': 'Couscous Intégral Maroc',
                'image': 'https://e-xportmorocco.com/uploads/products/1684/1684_1.jpg'
            },
        ]

        # Articles pour Vitagrain avec images
        vitagrain_articles = [
            {
                'nom': 'Céréales Muesli Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1685/1685_1.jpg'
            },
            {
                'nom': 'Flocons d\'Avoine Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1686/1686_1.jpg'
            },
            {
                'nom': 'Quinoa Bio Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1687/1687_1.jpg'
            },
            {
                'nom': 'Riz Basmati Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1688/1688_1.jpg'
            },
            {
                'nom': 'Lentilles Corail Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1689/1689_1.jpg'
            },
            {
                'nom': 'Pois Chiches Bio Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1690/1690_1.jpg'
            },
            {
                'nom': 'Graines de Tournesol Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1691/1691_1.jpg'
            },
            {
                'nom': 'Mix Céréales Petit-Déjeuner Vitagrain',
                'image': 'https://e-xportmorocco.com/uploads/products/1692/1692_1.jpg'
            },
        ]

        created_count = 0

        # Créer les articles pour KenzPat
        for article_data in kenzpat_articles:
            article, created = Article.objects.get_or_create(
                nom=article_data['nom'],
                societe='kenzpat',
                defaults={
                    'nom': article_data['nom'], 
                    'societe': 'kenzpat',
                    'image': article_data['image']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Créé: {article_data["nom"]} (KenzPat)')

        # Créer les articles pour Kenz Maroc
        for article_data in kenz_maroc_articles:
            article, created = Article.objects.get_or_create(
                nom=article_data['nom'],
                societe='kenz_maroc',
                defaults={
                    'nom': article_data['nom'], 
                    'societe': 'kenz_maroc',
                    'image': article_data['image']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Créé: {article_data["nom"]} (Kenz Maroc)')

        # Créer les articles pour Vitagrain
        for article_data in vitagrain_articles:
            article, created = Article.objects.get_or_create(
                nom=article_data['nom'],
                societe='vitagrain',
                defaults={
                    'nom': article_data['nom'], 
                    'societe': 'vitagrain',
                    'image': article_data['image']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Créé: {article_data["nom"]} (Vitagrain)')

        self.stdout.write(
            self.style.SUCCESS(
                f'Terminé! {created_count} nouveaux articles créés.'
            )
        )
