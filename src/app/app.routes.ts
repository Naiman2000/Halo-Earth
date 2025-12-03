import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Landing } from './pages/public/landing/landing';
import { Home } from './pages/public/home/home';
import { PartnerList } from './pages/public/partner-program/partner-list/partner-list';
import { PartnerDetail } from './pages/public/partner-program/partner-detail/partner-detail';
import { CoralList } from './pages/public/coral-species/coral-list/coral-list';
import { CoralDetail } from './pages/public/coral-species/coral-detail/coral-detail';
import { BlogList } from './pages/public/blog/blog-list/blog-list';
import { BlogDetail } from './pages/public/blog/blog-detail/blog-detail';
import { DonationForm } from './pages/public/donation/donation-form/donation-form';
import { ThankYou } from './pages/public/donation/thank-you/thank-you';
import { InterestForm } from './pages/public/forms/interest-form/interest-form';
import { ContactForm } from './pages/public/forms/contact-form/contact-form';
import { AboutUs } from './pages/public/static/about-us/about-us';
import { Newsletter } from './pages/public/newsletter/newsletter';
import { Volunteer } from './pages/public/volunteer/volunteer';
import { Faq } from './pages/public/static/faq/faq';
import { Gallery } from './pages/public/static/gallery/gallery';

import { Login } from './pages/admin/auth/login/login';
import { Signout } from './pages/admin/auth/signout/signout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { PartnerManagement } from './pages/admin/partner-management/partner-management';
import { CoralManagement } from './pages/admin/coral-management/coral-management';
import { BlogManagement } from './pages/admin/blog-management/blog-management';
import { DonationManagement } from './pages/admin/donation-management/donation-management';
import { LeadManagement } from './pages/admin/lead-management/lead-management';
import { MessageManagement } from './pages/admin/message-management/message-management';
import { SiteSettings } from './pages/admin/site-settings/site-settings';
import { GalleryManagement } from './pages/admin/gallery-management/gallery-management';

export const routes: Routes = [
    {
        path: 'admin/login',
        component: Login
    },
    {
        path: 'admin/auth/signout',
        component: Signout
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'partners', component: PartnerManagement },
            { path: 'corals', component: CoralManagement },
            { path: 'blog', component: BlogManagement },
            { path: 'donations', component: DonationManagement },
            { path: 'leads', component: LeadManagement },
            { path: 'messages', component: MessageManagement },
            { path: 'settings', component: SiteSettings },
            { path: 'gallery', component: GalleryManagement },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: PublicLayout,
        children: [
            { path: '', component: Landing },
            { path: 'mycoral', component: Home },
            { path: 'partners', component: PartnerList },
            { path: 'partners/:id', component: PartnerDetail },
            { path: 'corals', component: CoralList },
            { path: 'corals/:id', component: CoralDetail },
            { path: 'blog', component: BlogList },
            { path: 'blog/:id', component: BlogDetail },
            { path: 'donate', component: DonationForm },
            { path: 'donate/thank-you', component: ThankYou },
            { path: 'interest', component: InterestForm },
            { path: 'contact', component: ContactForm },
            { path: 'about', component: AboutUs },
            { path: 'newsletter', component: Newsletter },
            { path: 'volunteer', component: Volunteer },
            { path: 'faq', component: Faq },
            { path: 'gallery', component: Gallery }
        ]
    },
    { path: '**', redirectTo: '' }
];
