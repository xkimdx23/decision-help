require('dotenv').config();
const mongoose = require('mongoose');
const Translation = require('./src/models/Translation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/decisiondb';

const translations = {
  es: {
    make_decision: "🤔 Toma Tu Decisión",
    positive_choices: "Elecciones positivas para una vida mejor",
    this_or_that: "Esto o Aquello",
    yes_or_no: "Sí o No",
    pick_from_list: "Elige de la Lista",
    your_question: "Tu Pregunta",
    question_placeholder: "ej., ¿Debería aprender guitarra o piano?",
    option_a: "Opción A",
    option_b: "Opción B",
    help_me_decide: "¡Ayúdame a decidir!",
    home: "Inicio",
    history: "Historial",
    community: "Comunidad",
    about: "Acerca de",
    profile: "Perfil",
    login: "Iniciar Sesión",
    register: "Registrarse",
    loading: "Cargando...",
    prev: "Anterior",
    next: "Siguiente",
    page: "Página",
  },
  fr: {
    make_decision: "🤔 Prenez Votre Décision",
    positive_choices: "Des choix positifs pour une vie meilleure",
    this_or_that: "Ceci ou Cela",
    yes_or_no: "Oui ou Non",
    pick_from_list: "Choisir dans la Liste",
    help_me_decide: "Aidez-moi à décider !",
    home: "Accueil",
    history: "Historique",
    community: "Communauté",
    about: "À Propos",
    loading: "Chargement...",
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    for (const [lang, keys] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(keys)) {
        await Translation.findOneAndUpdate(
          { language_code: lang, key },
          { value },
          { upsert: true }
        );
      }
    }
    
    console.log('✅ Translations seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
