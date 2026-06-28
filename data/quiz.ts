export interface QuizQuestion {
  q: string;
  opts: string[];
  a: number; // index of correct answer
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { q: "Who holds the record for most F1 World Championships?", opts: ["Ayrton Senna", "Michael Schumacher", "Lewis Hamilton", "Sebastian Vettel"], a: 2 },
  { q: "Which circuit is often called the 'Cathedral of Speed'?", opts: ["Silverstone", "Monaco", "Monza", "Spa"], a: 2 },
  { q: "Who won the 2021 F1 World Championship on the final lap?", opts: ["Lewis Hamilton", "Max Verstappen", "Valtteri Bottas", "Charles Leclerc"], a: 1 },
  { q: "Which circuit is often called Max's 'home race'?", opts: ["Zandvoort", "Spa-Francorchamps", "Monaco", "Silverstone"], a: 0 },
  { q: "What does Pole Position mean?", opts: ["Fastest qualifying time", "First corner advantage", "Best team result", "Fastest race lap"], a: 0 },
  { q: "Which team did Ayrton Senna drive for when he won his first title?", opts: ["Williams", "McLaren", "Lotus", "Ferrari"], a: 1 },
  { q: "At which circuit did Senna take six victories?", opts: ["Monaco", "Monza", "Suzuka", "Silverstone"], a: 0 },
  { q: "Who is known as 'The Professor' of F1?", opts: ["Niki Lauda", "Alain Prost", "Jackie Stewart", "Jim Clark"], a: 1 },
  { q: "How many constructors did Fangio win championships with?", opts: ["2", "3", "4", "5"], a: 2 },
  { q: "Which team won both driver and constructor titles in 2009 at their very first attempt?", opts: ["Red Bull", "Renault", "Brawn GP", "Ferrari"], a: 2 },
];
