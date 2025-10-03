'use strict';

// Initialize AOS animations
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });
}

// Theme Toggle (Light/Dark)
(function themeToggle() {
  const root = document.documentElement; // uses [data-theme] in CSS
  const toggle = document.getElementById('theme-toggle');
  const NAVBAR_ACTIVE_CLASS = 'active';

  // Restore persisted theme
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') root.setAttribute('data-theme', 'dark');

  const applyIcon = () => {
    if (!toggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    toggle.innerHTML = `<i class="fas ${isDark ? 'fa-moon' : 'fa-sun'}"></i>`;
  };
  const applyThemeAssets = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const logo = document.querySelector('.brand-logo');
    if (logo) logo.setAttribute('src', isDark ? 'assets/logo-dark.svg' : 'assets/logo-light.svg');
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.setAttribute('href', isDark ? 'assets/logo-dark.svg' : 'assets/logo-light.svg');
  };
  applyIcon();
  applyThemeAssets();

  toggle?.addEventListener('click', () => {
    // Add a brief fade effect while switching theme
    document.body.classList.add('theme-fade');
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    applyIcon();
    applyThemeAssets();
    setTimeout(() => document.body.classList.remove('theme-fade'), 350);
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  navToggle?.addEventListener('click', () => navMenu?.classList.toggle(NAVBAR_ACTIVE_CLASS));
  // Close menu on link click (mobile) + smooth scroll
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', (e) => {
    navMenu?.classList.remove(NAVBAR_ACTIVE_CLASS);
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }));
})();

// i18n: EN/FR translations and toggle
(function i18nModule() {
  const dict = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.education': 'Education',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.experience': 'Experience',
      'nav.contact': 'Contact',
      'nav.tech': 'Technical Skills',
      'hero.subtitle': 'Data Analyst & BI Engineer',
      'hero.description': 'Transforming complex data into actionable insights through advanced analytics, interactive dashboards, and business intelligence solutions. Specialized in Power BI, Tableau, and data-driven decision making.',
      'hero.cta_contact': 'Get In Touch',
      'hero.cta_cv': 'Download CV',
      'experience.title': 'Professional Experience',
      'about.title': 'About Me',
      'about.subtitle': 'Passionate about turning data into insights',
      'skills.title': 'Technical Skills',
      'skills.subtitle': 'Expertise in modern BI and data analytics tools',
      'tech.title': 'Technical Skills',
      'tech.subtitle': 'Core platforms, languages, and tools I use daily',
      'projects.title': 'Featured Projects',
      'projects.subtitle': 'Showcasing impactful BI solutions and data analytics projects',
      'filters.all': 'All Projects',
      'filters.powerbi': 'Power BI',
      'filters.tableau': 'Tableau',
      'filters.analytics': 'Oracle Analytics',
      'projects.kpis': 'KPIs:',
      'projects.coverage': 'KPIS:',
      'projects.dashboard_suite': 'KPIS:',
      'projects.dalkia.desc': 'Comprehensive energy management dashboard tracking annual obligations, energy consumption (MWhc/kWhc), and regional performance metrics for sustainable energy initiatives.',
      'projects.itsm.desc': 'IT Service Management dashboard providing comprehensive incident tracking, resolution analytics, and performance monitoring across multiple subsidiaries.',
      'projects.farmer.desc': 'Multi-country agricultural analytics platform covering farmer demographics, crop analysis, and fertilizer usage across five African countries with interactive country selection and comprehensive KPI tracking.',
      'projects.supply.desc': 'Supply chain optimization dashboard tracking logistics costs, inventory, and delivery performance across multiple countries and warehouses.',
      'projects.marketing.desc': 'Multi-dashboard marketing analytics suite featuring engagement tracking, cost analysis, performance monitoring, and conversion optimization across channels.',
      // Project KPIs (EN)
      'projects.dalkia.k1': 'Annual obligation margins by account',
      'projects.dalkia.k2': 'MWhc consumption by precarious obligation',
      'projects.dalkia.k3': 'Regional vs obligation performance analysis',
      'projects.dalkia.k4': 'Classic and precarious amount tracking',
      'projects.farmer.k1': "5 Countries: Senegal, Nigeria, Kenya, Côte d'Ivoire, Ghana",
      'projects.farmer.k2': 'Farmer demographics and gender analysis',
      'projects.farmer.k3': 'Fertilizer usage patterns and brand analysis',
      'projects.farmer.k4': 'Crop distribution and intercropping insights',
      'projects.supply.k1': 'Country-wise cost and delivery analysis',
      'projects.supply.k2': 'Warehouse stock volume optimization',
      'projects.supply.k3': 'Stock turnover and sales volume tracking',
      'projects.supply.k4': 'Logistics and storage cost management',
      'projects.marketing.k1': 'Engagement and interaction analytics',
      'projects.marketing.k2': 'Campaign cost analysis and optimization',
      'projects.marketing.k3': 'Marketing performance reporting',
      'projects.marketing.k4': 'Conversion and performance tracking',
      'projects.it.desc': 'Comprehensive IT operations dashboard tracking SAP system usage, license management, training activities, and transaction monitoring across the organization.',
      'projects.it.k1': 'SAP modules usage and adoption tracking',
      'projects.it.k2': 'Data integration and system connectivity monitoring',
      'projects.it.k3': 'License allocation and utilization analysis',
      'projects.it.k4': 'Training completion and transaction volume tracking',
      'projects.itsm.k1': 'Total incidents and resolution tracking',
      'projects.itsm.k2': 'Average resolution time analysis',
      'projects.itsm.k3': 'Incident categorization and priority management',
      'projects.itsm.k4': 'Backlog production responsibility monitoring',
      'projects.powerbi.title': 'Power BI Dashboard Projects',
      'projects.powerbi.desc': 'Exciting Power BI dashboard projects featuring advanced analytics, interactive visualizations, and comprehensive business intelligence solutions are currently in development and will be available soon.',
      'projects.oracle.title': 'Oracle Analytics Cloud Projects',
      'projects.oracle.desc': 'Oracle Analytics Cloud dashboard projects showcasing data visualization, predictive analytics, and enterprise-level reporting solutions are under development and coming soon.',
      
      // Experience bullets
      'exp.freelance.b1': 'Design interactive BI dashboards (Power BI/Tableau) to support decision‑making.',
      'exp.freelance.b2': 'Model and transform data, integrate SQL Server and ETL workflows.',
      'exp.freelance.title': 'Data Analyst — Freelance',
      'exp.hcp.title': 'Official Surveyor — High Commission for Planning, Morocco',
      'exp.hcp.b1': 'Collect accurate and reliable information from citizens.',
      'exp.hcp.b2': 'Ensure the confidentiality and accuracy of collected data.',
      'exp.jobintech.title': 'Cybersecurity Analyst — JOBINTECH',
      'exp.jobintech.b1': 'Monitored and analyzed security threats and vulnerabilities.',
      'exp.jobintech.b2': 'Implemented security protocols and incident response procedures.',
      'exp.dna.b1': 'Built Tableau dashboards; processed data with Talend; modeled in SQL Server.',
      'exp.dna.b2': 'Contributed to data marts, multidimensional models, and KPI frameworks.',
      'exp.dna.title': 'BI Consultant Intern — D&A Technologies',
      'exp.ocp.b1': 'Manipulated data using Python, R, SQL Server.',
      'exp.ocp.b2': 'Used Matplotlib and Seaborn for exploratory analysis and reporting.',
      'exp.ocp.title': 'Data Analyst Intern — OCP Group',
      'exp.dejla.b1': 'Developed a sales website with PHP, HTML, JavaScript, MySQL; from concept to delivery.',
      'exp.dejla.title': 'Full‑Stack Developer Intern — DEJLA FER',
      'contact.title': 'Get In Touch',
      'contact.subtitle': "Let's discuss your next data analytics project",
      'contact.email': 'Email',
      'contact.phone': 'Phone',
      'contact.location': 'Location',
      'contact.form.name': 'Full Name',
      'contact.form.email': 'Email Address',
      'contact.form.subject': 'Subject',
      'contact.form.message': 'Message',
      'contact.form.send': 'Send Message',
      'footer.about': 'About',
      'footer.about_desc': 'Data Analyst & BI Engineer building modern analytics solutions.',
      'footer.links': 'Links',
      'footer.contact': 'Contact',
      'footer.languages': 'Languages',
      'footer.switch': 'Use the toggle in the navbar to change language.'
    },
    fr: {
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.education': 'Éducation',
      'nav.skills': 'Compétences',
      'nav.projects': 'Projets',
      'nav.experience': 'Expérience',
      'nav.contact': 'Contact',
      'nav.tech': 'Stack Technique',
      'hero.subtitle': 'Data Analyst & Ingénieure BI',
      'hero.description': "Transformer des données complexes en insights actionnables via l'analytique avancée, des tableaux de bord interactifs et des solutions BI. Spécialisée en Power BI, Tableau et la prise de décision basée sur les données.",
      'hero.cta_contact': 'Me contacter',
      'hero.cta_cv': 'Télécharger le CV',
      'experience.title': 'Expérience Professionnelle',
      'experience.subtitle': "Parcours de 2018 à aujourd'hui",
      'about.title': 'À propos de moi',
      'about.subtitle': 'Passionnée par la transformation des données en insights',
      'skills.title': 'Compétences Techniques',
      'skills.subtitle': 'Expertise en outils BI et data analytics modernes',
      'tech.title': 'Stack Technique',
      'tech.subtitle': 'Plateformes, langages et outils utilisés au quotidien',
      'projects.title': 'Projets phares',
      'projects.subtitle': 'Des solutions BI et analytiques à fort impact',
      'filters.all': 'Tous les projets',
      'filters.powerbi': 'Power BI',
      'filters.tableau': 'Tableau',
      'filters.analytics': 'Oracle Analytics',
      'projects.kpis': 'KPIS:',
      'projects.coverage': 'KPIS:',
      'projects.dashboard_suite': 'KPIS:',
      'projects.dalkia.desc': "Tableau de bord de gestion de l'énergie couvrant les obligations annuelles, la consommation (MWhc/kWhc) et les performances régionales pour des initiatives durables.",
      'projects.itsm.desc': "Tableau de bord ITSM offrant un suivi complet des incidents, des analyses de résolution et un contrôle des performances à travers plusieurs filiales.",
      'projects.farmer.desc': "Plateforme analytique multi‑pays couvrant la démographie des agriculteurs, l'analyse des cultures et l'utilisation d'engrais dans cinq pays africains, avec sélection interactive et suivi complet des indicateurs.",
      'projects.supply.desc': "Tableau de bord d'optimisation de la chaîne d'approvisionnement: coûts logistiques, stocks et performance des livraisons à travers plusieurs pays et entrepôts.",
      'projects.marketing.desc': "Suite analytique marketing multi‑tableaux de bord: engagement, coûts, performances et optimisation des conversions sur plusieurs canaux.",
      // Project KPIs (FR)
      'projects.dalkia.k1': "Marges d'obligation annuelle par compte",
      'projects.dalkia.k2': "Consommation en MWhc selon l'obligation précaire",
      'projects.dalkia.k3': "Analyse de performance régionale vs obligation",
      'projects.dalkia.k4': "Suivi des montants classiques et précaires",
      'projects.farmer.k1': "5 pays: Sénégal, Nigéria, Kenya, Côte d'Ivoire, Ghana",
      'projects.farmer.k2': "Démographie des agriculteurs et analyse par genre",
      'projects.farmer.k3': "Schémas d'utilisation des engrais et analyse des marques",
      'projects.farmer.k4': "Répartition des cultures et polyculture",
      'projects.supply.k1': "Analyse des coûts et livraisons par pays",
      'projects.supply.k2': "Optimisation du volume de stock par entrepôt",
      'projects.supply.k3': "Rotation des stocks et suivi des volumes de ventes",
      'projects.supply.k4': "Gestion des coûts logistiques et de stockage",
      'projects.marketing.k1': "Analytique d'engagement et d'interaction",
      'projects.marketing.k2': "Analyse et optimisation des coûts de campagne",
      'projects.marketing.k3': "Rapports de performance marketing",
      'projects.marketing.k4': "Suivi des conversions et des performances",
      'projects.it.desc': "Tableau de bord des opérations IT suivant l'utilisation du système SAP, la gestion des licences, les activités de formation et le monitoring des transactions à travers l'organisation.",
      'projects.it.k1': "Suivi de l'utilisation et de l'adoption des modules SAP",
      'projects.it.k2': "Monitoring de l'intégration des données et de la connectivité système",
      'projects.it.k3': "Analyse de l'allocation et de l'utilisation des licences",
      'projects.it.k4': "Suivi de la formation et du volume des transactions",
      'projects.itsm.k1': "Suivi total des incidents et résolutions",
      'projects.itsm.k2': "Analyse du temps de résolution moyen",
      'projects.itsm.k3': "Catégorisation des incidents et gestion des priorités",
      'projects.itsm.k4': "Suivi du backlog et responsabilités de production",
      'projects.powerbi.title': 'Projets de tableaux de bord Power BI',
      'projects.powerbi.desc': "Projets passionnants de tableaux de bord Power BI avec des analyses avancées, des visualisations interactives et des solutions BI complètes en cours de développement, disponibles bientôt.",
      'projects.oracle.title': 'Projets Oracle Analytics Cloud',
      'projects.oracle.desc': "Projets Oracle Analytics Cloud présentant la visualisation de données, l'analytique prédictive et des solutions de reporting d'entreprise en cours de développement.",
      
      // Experience bullets
      'exp.freelance.b1': 'Conception de tableaux de bord BI (Power BI/Tableau) pour la prise de décision.',
      'exp.freelance.b2': 'Modélisation et transformation des données, intégration SQL Server et ETL.',
      'exp.freelance.title': 'Data Analyst — Freelance',
      'exp.hcp.title': 'Enquêteur Officiel — Haut Commissariat au Plan du Maroc',
      'exp.hcp.b1': 'Collecter des informations précises et fiables auprès des citoyens.',
      'exp.hcp.b2': 'Garantir la confidentialité et l\'exactitude des données collectées.',
      'exp.jobintech.title': 'Analyste en Cybersécurité — JOBINTECH',
      'exp.jobintech.b1': 'Surveillance et analyse des menaces et vulnérabilités de sécurité.',
      'exp.jobintech.b2': 'Mise en œuvre de protocoles de sécurité et procédures de réponse aux incidents.',
      'exp.dna.b1': 'Création de tableaux de bord Tableau; traitement des données avec Talend; modélisation sous SQL Server.',
      'exp.dna.b2': 'Contribution aux data marts, modèles multidimensionnels et cadres d’indicateurs (KPI).',
      'exp.dna.title': 'Stagiaire Consultante BI — D&A Technologies',
      'exp.ocp.b1': 'Manipulation de données avec Python, R, SQL Server.',
      'exp.ocp.b2': 'Utilisation de Matplotlib et Seaborn pour l’analyse exploratoire et le reporting.',
      'exp.ocp.title': 'Stagiaire Data Analyst — Groupe OCP',
      'exp.dejla.b1': 'Développement d’un site de vente en PHP, HTML, JavaScript, MySQL; de la conception à la livraison.',
      'exp.dejla.title': 'Stagiaire Développeuse Full‑Stack — DEJLA FER',
      'contact.title': 'Contact',
      'contact.subtitle': 'Discutons de votre prochain projet data',
      'contact.email': 'Email',
      'contact.phone': 'Téléphone',
      'contact.location': 'Localisation',
      'contact.form.name': 'Nom complet',
      'contact.form.email': 'Adresse email',
      'contact.form.subject': 'Objet',
      'contact.form.message': 'Message',
      'contact.form.send': 'Envoyer',
      'footer.about': 'À propos',
      'footer.about_desc': 'Data Analyst & Ingénieure BI, créant des solutions analytiques modernes.',
      'footer.links': 'Liens',
      'footer.contact': 'Contact',
      'footer.languages': 'Langues',
      'footer.switch': 'Utilisez le sélecteur dans la barre pour changer la langue.'
    }
  };

  const applyTranslations = (lang) => {
    const strings = dict[lang] || dict.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = strings[key];
      if (!val) return;
      const tag = el.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        el.setAttribute('placeholder', val);
        return;
      }
      // Preserve leading icons or child elements (e.g., <i> icons in buttons)
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = `${icon.outerHTML} ${val}`;
      } else {
        el.textContent = val;
      }
    });
    document.documentElement.setAttribute('lang', lang);
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.textContent = lang.toUpperCase();

    // Update CV download link based on current language
    try {
      const cvLink = document.querySelector('[data-i18n="hero.cta_cv"]');
      if (cvLink && cvLink.tagName.toLowerCase() === 'a') {
        const href = lang === 'fr' ? 'assets/FR.pdf' : 'assets/ENG.pdf';
        cvLink.setAttribute('href', href);
        cvLink.setAttribute('download', '');
      }
    } catch (_) { /* noop */ }
  };

  const storedLang = localStorage.getItem('lang') || 'en';
  applyTranslations(storedLang);

  const langToggle = document.getElementById('lang-toggle');
  langToggle?.addEventListener('click', () => {
    const current = localStorage.getItem('lang') || 'en';
    const next = current === 'en' ? 'fr' : 'en';
    localStorage.setItem('lang', next);
    applyTranslations(next);
  });
})();

// Image Lightbox for project carousels
(function projectLightbox() {
  const lb = document.getElementById('image-lightbox');
  if (!lb) return;

  const imgEl = lb.querySelector('.lightbox-image');
  const captionEl = lb.querySelector('.lightbox-caption');
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev = lb.querySelector('.lightbox-prev');
  const btnNext = lb.querySelector('.lightbox-next');

  let group = [];
  let index = 0;

  const render = () => {
    if (!group.length) return;
    const item = group[index];
    imgEl.src = item.src;
    imgEl.alt = item.alt || '';
    if (captionEl) captionEl.textContent = item.alt || '';
  };

  const open = (items, startIndex = 0) => {
    group = items;
    index = startIndex;
    render();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // cleanup image to stop network on slow links
    imgEl.removeAttribute('src');
  };

  const prev = () => { if (!group.length) return; index = (index - 1 + group.length) % group.length; render(); };
  const next = () => { if (!group.length) return; index = (index + 1) % group.length; render(); };

  // Wire controls
  btnClose?.addEventListener('click', close);
  btnPrev?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  btnNext?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Click to open from carousel slides
  document.querySelectorAll('.projects .carousel').forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    if (!slides.length) return;
    const items = slides.map(s => ({ src: s.getAttribute('src'), alt: s.getAttribute('alt') }));
    slides.forEach((s, i) => {
      s.style.cursor = 'zoom-in';
      s.addEventListener('click', () => open(items, i));
    });
  });
})();

// Skill bars animation using IntersectionObserver
(function skillBars() {
  const bars = document.querySelectorAll('.skill-progress');
  if (!bars.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Prefer the visible percentage text if present (keeps bars in sync when labels are edited)
        let width = el.getAttribute('data-width') || '0%';
        try {
          const percentageEl = el.closest('.skill-item')?.querySelector('.skill-percentage');
          const percentText = percentageEl?.textContent?.trim();
          if (percentText && /\d+%/.test(percentText)) {
            width = percentText.match(/\d+%/)[0];
          }
        } catch (_) { /* noop */ }
        el.style.width = width;
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
})();

// Project filters
(function projectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    cards.forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
      } else {
        const show = card.classList.contains(filter);
        card.style.display = show ? '' : 'none';
      }
    });
  }));
})();

// Project Modal Logic
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openProjectModal(key) {
  const data = getProjectData(key);
  if (!data) return;

  modalTitle.textContent = data.title;
  modalBody.innerHTML = `
    <div class="modal-section">
      <p>${data.description}</p>
      <div class="modal-tags">
        ${data.skills.map(s => `<span class='tag ${s.highlight ? 'primary' : ''}'>${s.name}</span>`).join('')}
      </div>
      <h4>KPIs / Features</h4>
      <ul>
        ${data.kpis.map(k => `<li>${k}</li>`).join('')}
      </ul>
      
     
    </div>`;

  modal.style.display = 'block';
}

function closeProjectModal() {
  modal.style.display = 'none';
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

window.addEventListener('click', (e) => {
  if (e.target === modal) closeProjectModal();
});

function getProjectData(key) {
  switch (key) {
    case 'dalkia':
      return {
        title: 'Tableau de board Dalkia -EDF Group ',
        description: 'Energy management analytics covering obligations, consumption, and regional performance.',
        skills: [
          { name: 'Tableau', highlight: true },
          { name: 'SQL Server' },
          { name: 'Pentaho' },
          { name: 'SQL ' },
        ],
        kpis: [
          "Marge selon l'obligation annuelle par compte",
          "Somme MWhc selon l'obligation précaire par compte",
          "Somme kWhc selon l'obligation classique par compte",
          "Réalisée vs Obligation en MWhc par région et par centre",
          "Montant classique et précaire",
          "Filtres: Date de création, Fiche CEE, Bénéficiaire, Type de compte",
        ],
      };
    case 'itsm':
      return {
        title: 'IT Dashboard - OCP Group',
        description: 'Incident management and support analytics across subsidiaries with SLA monitoring.',
        skills: [
          { name: 'Tableau', highlight: true },
          { name: 'SQL' },
          { name: 'SQL Server' },
          { name: 'Pentaho' },
          { name: 'Tableau Prep' },
        ],
        kpis: [
          'Total incidents, opened/closed, and backlog age',
          'Resolution time and weekly averages',
          'Incidents by subsidiary and category',
          'Priority-based open/closed tracking',
          'Entry/Exit incidents by week',
        ],
      };
    case 'farmer':
      return {
        title: 'Farmer Analytics Dashboard – OCP Africa',
        description: 'Multi-country platform for farmer demographics, crop patterns, and fertilizer usage.',
        skills: [
          { name: 'Tableau', highlight: true },
          { name: 'SQL' },
          { name: 'SQL Server' },
          { name: 'Pentaho' },
          { name: 'Tableau Prep' },
        ],
        kpis: [
          'Country selector with flags (SN, NG, KE, CI, GH)',
          'Gender distribution, farm area, and demographics',
          'Fertilizer use rates, types, and brands',
          'Trends of total farmers and overview per country',
          'Filters: year, crop, program',
        ],
      };
    case 'supply':
      return {
        title: 'Supply Chain Dashboard – OCP Africa',
        description: 'Logistics, inventory, and cost optimization across regions and warehouses.',
        skills: [
          { name: 'Tableau', highlight: true },
          { name: 'SQL' },
          { name: 'SQL Server' },
          { name: 'Pentaho' },
          { name: 'Tableau Prep' },
        ],
        kpis: [
          'Country car and cost analysis',
          'Sales delivery value per country',
          'Top warehouse and product by stock volume',
          'Stock turnover, stock and sales volume',
          'Logistic and storage costs',
        ],
      };
    case 'marketing':
      return {
        title: 'Marketing Campaign Analysis Dashboard - Sopriam ',
        description: 'Campaign engagement, cost, conversion, and performance analytics across dashboards.',
        skills: [
          { name: 'Tableau', highlight: true },
          { name: 'SQL' },
          { name: 'SQL Server' },
          { name: 'Pentaho' },
          { name: 'Tableau Prep' },
        ],
        kpis: [
          'Menu dashboards & reports',
          'Engagement & interaction dashboard',
          'Campaign cost analysis dashboard',
          'Marketing performance report',
          'Conversion & performance dashboards',
        ],
      };
    default:
      return null;
  }
}

// Contact form handler
(function contactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Mailto fallback (no server setup required)
    const mailto = `mailto:hafsaelatouani@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;

    // Optional: show a toast
    alert('Opening your email client to send the message.');
    form.reset();
  });
})();

// Sticky navbar effect on scroll
(function stickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
})();

// Project image carousels
(function carousels() {
  const carousels = document.querySelectorAll('.carousel');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll('.slide');
    if (!slides.length) return;
    let idx = 0;
    const setActive = (i) => {
      slides.forEach((s, k) => s.classList.toggle('active', k === i));
    };
    setActive(idx);

    let paused = false;
    const tick = () => {
      if (paused) return;
      idx = (idx + 1) % slides.length;
      setActive(idx);
    };
    const interval = setInterval(tick, 3500);

    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { paused = false; });

    // Re-apply active once images load (ensures first frame shows)
    slides.forEach(img => img.addEventListener('load', () => setActive(idx)));

    // Clean up if needed
    window.addEventListener('beforeunload', () => clearInterval(interval));

    // Prev/Next controls
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    if (prevBtn && nextBtn) {
      const goPrev = () => { idx = (idx - 1 + slides.length) % slides.length; setActive(idx); };
      const goNext = () => { idx = (idx + 1) % slides.length; setActive(idx); };
      prevBtn.addEventListener('click', (e) => { e.preventDefault(); goPrev(); });
      nextBtn.addEventListener('click', (e) => { e.preventDefault(); goNext(); });
      // Hide controls if only one slide
      if (slides.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }
  });
})();
