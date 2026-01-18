import { Request, Response } from 'express';

export const chat = async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ response: "Please say something." });
    }

    const lowerMessage = message.toLowerCase();

    let response = "I'm sorry, I didn't understand that. can you describe your symptoms?";

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = "Hello! I am Medico Bot. How can I help you today?";
    } else if (lowerMessage.includes('headache')) {
        response = "A headache can be caused by stress, dehydration, or lack of sleep. Try drinking water and resting.";
    } else if (lowerMessage.includes('fever')) {
        response = "A fever indicates your body is fighting an infection. Monitor your temperature and stay hydrated.";
    } else if (lowerMessage.includes('stomach')) {
        response = "Stomach pain can be due to indigestion or food poisoning. Avoid heavy meals.";
    } else if (lowerMessage.includes('appointment')) {
        response = "You can book an appointment through your dashboard.";
    } else if (lowerMessage.includes('covid')) {
        response = "Common symptoms of COVID-19 include fever, cough, and tiredness. Please test yourself if you have these.";
    }

    res.json({ response });
};

export const symptomChecker = async (req: Request, res: Response) => {
    const { symptoms } = req.body; // Array of strings

    let diagnosis = "Unsure. Please consult a doctor.";

    if (!symptoms || !Array.isArray(symptoms)) {
        return res.status(400).json({ message: "Invalid input. Symptoms must be an array." });
    }

    const s = symptoms.map((sy: string) => sy.toLowerCase());

    if (s.includes('fever') && s.includes('cough')) {
        diagnosis = "Possible Cold or Flu.";
    } else if (s.includes('headache') && s.includes('nausea')) {
        diagnosis = "Possible Migraine.";
    } else if (s.includes('chest pain')) {
        diagnosis = "Please seek immediate medical attention.";
    } else if (s.includes('rash') && s.includes('itching')) {
        diagnosis = "Possible Allergic Reaction.";
    }

    res.json({ diagnosis, advice: "This is not a medical diagnosis. Please see a doctor." });
};
