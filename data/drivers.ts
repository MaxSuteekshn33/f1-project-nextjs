export interface Driver {
  key: string;
  name: string;
  country: string;
  era: string;
  team: string;
  peak: string;
  photo: string;
  car: string;
  teamColor: string;
  pace: number;
  quali: number;
  racecraft: number;
  wet: number;
  tyres: number;
  consistency: number;
  titles: number;
  wins: number;
  poles: number;
  quote: string;
  bio: string;
  facts: { k: string; v: string }[];
  locked?: boolean;
  unlockHint?: string;
  rationale?: Record<string, string>;
}

export const DRIVERS: Driver[] = [
  {
    key: "fangio", name: "Juan Manuel Fangio", country: "Argentina", era: "1950s",
    team: "Alfa Romeo · Maserati · Mercedes · Ferrari", peak: "1951–1957",
    photo: "/drivers/fangio.jpeg", car: "/cars/Fangio 1957.avif", teamColor: "#8b3a1c",
    pace: 94, quali: 94, racecraft: 95, wet: 90, tyres: 88, consistency: 95,
    titles: 5, wins: 24, poles: 29,
    quote: "You must always strive to be the best, but never believe that you are.",
    bio: "The first undisputed GOAT of Formula 1. Fangio won five world championships across four different constructors in a career that spanned the most dangerous era of the sport. His 1957 German Grand Prix comeback — overcoming a 50-second deficit after a pit stop to overtake both Ferraris — is still considered the greatest drive in F1 history. He retired at 47, having proven that intelligence and precision could beat raw youth.",
    facts: [{ k: "Championships", v: "5" }, { k: "Race Wins", v: "24" }, { k: "Pole Positions", v: "29" }, { k: "Win Rate", v: "47%" }, { k: "Peak Year", v: "1957" }, { k: "Teams", v: "4 diff." }],
    rationale: {
      pace: "94 — Dominant across five different constructors in an era without data, telemetry or modern safety. His peak pace was generational.",
      quali: "94 — Regularly at the front of the grid across multiple teams — exceptional given he was adapting to new machinery each season.",
      racecraft: "95 — The 1957 German GP comeback at the Nürburgring — after a pit stop, he overtook both Ferraris with the fastest laps of the race — is considered the greatest drive ever.",
      wet: "90 — Competent in varied conditions but the era offered few memorable wet epics to benchmark against modern drivers.",
      tyres: "88 — Tyre management in the 1950s was a cruder science; ratings reflect a different strategic landscape.",
      consistency: "95 — Five championships from eight seasons. Won with four different constructors. The statistical argument for the greatest of all time.",
    },
  },
  {
    key: "moss", name: "Stirling Moss", country: "United Kingdom", era: "1950s",
    team: "Maserati · Vanwall · Lotus", peak: "1955–1961",
    photo: "/drivers/moss.jpg", car: "/cars/Moss 1958.jpg", teamColor: "#808080",
    pace: 95, quali: 93, racecraft: 95, wet: 93, tyres: 86, consistency: 84,
    titles: 0, wins: 16, poles: 16,
    quote: "To achieve anything in this game, you must be prepared to dabble on the boundary of disaster.",
    bio: "The greatest driver never to win a world championship. Moss was the complete package — fast, brave, and a genuine sportsman. He famously gave evidence that saved rival Mike Hawthorn from disqualification in 1958, directly costing himself the title. At the 1961 Monaco GP, he held off the far faster Ferraris in a slower Lotus for the entire race — one of the most brilliant displays of racecraft in F1 history.",
    facts: [{ k: "Championships", v: "0" }, { k: "Race Wins", v: "16" }, { k: "Pole Positions", v: "16" }, { k: "Runner-up", v: "4×" }, { k: "Peak Year", v: "1958" }, { k: "Teams", v: "Multiple" }],
  },
  {
    key: "clark", name: "Jim Clark", country: "Scotland", era: "1960s",
    team: "Lotus", peak: "1963–1965",
    photo: "/drivers/clark.jpeg", car: "/cars/Clark 1965.jpg", teamColor: "#1a7055",
    pace: 98, quali: 97, racecraft: 94, wet: 92, tyres: 89, consistency: 85,
    titles: 2, wins: 25, poles: 33,
    quote: "Drive through the corner as though there isn't one.",
    bio: "Jim Clark had a gift that set him apart from everyone else — he made driving an F1 car look effortless. Teammates and rivals described watching him as watching something from another world. He won the 1965 World Championship AND the Indianapolis 500 in the same year, competing in both championships simultaneously. His partnership with Colin Chapman at Lotus produced some of the most dominant performances in the sport's history.",
    facts: [{ k: "Championships", v: "2" }, { k: "Race Wins", v: "25" }, { k: "Pole Positions", v: "33" }, { k: "Indy 500", v: "1965 Win" }, { k: "Peak Year", v: "1965" }, { k: "Team", v: "Lotus" }],
    rationale: {
      pace: "98 — Nearly every analyst of the pre-1970 era rates Clark's natural pace as second only to Fangio. His 1963 season was imperious.",
      quali: "97 — 33 pole positions from 72 starts (46% rate). In dominant years he simply drove away from the field.",
      racecraft: "94 — Preferred to lead from the front rather than fight through the pack — supremely controlled when he needed to be.",
      wet: "92 — Several strong wet performances including the 1963 Belgian GP. Not the wet legend Senna was, but very capable.",
      tyres: "89 — His smooth style was naturally gentle on tyres, but the era's compounds make precise comparison difficult.",
      consistency: "85 — His Lotus machinery was as brilliant as it was fragile. Mechanical failures cost him multiple championships.",
    },
  },
  {
    key: "stewart", name: "Jackie Stewart", country: "Scotland", era: "1970s",
    team: "Tyrrell", peak: "1969–1973",
    photo: "/drivers/stewart.jpeg", car: "/cars/Stewart 1971.jpg", teamColor: "#003882",
    pace: 93, quali: 92, racecraft: 93, wet: 96, tyres: 90, consistency: 94,
    titles: 3, wins: 27, poles: 17,
    quote: "It takes more than just being quick.",
    bio: "Jackie Stewart revolutionised Formula 1 in two ways — through his driving and through his relentless campaign for driver safety. He won three world championships and was the first driver to truly systematise how to go racing: managing pace, energy, and tyres rather than simply driving flat out. His 1968 German GP victory at the Nürburgring in fog and rain — by over four minutes — remains one of the most astonishing performances in motorsport history.",
    facts: [{ k: "Championships", v: "3" }, { k: "Race Wins", v: "27" }, { k: "Pole Positions", v: "17" }, { k: "Win Rate", v: "27.3%" }, { k: "Peak Year", v: "1973" }, { k: "Retired", v: "At peak" }],
  },
  {
    key: "lauda", name: "Niki Lauda", country: "Austria", era: "1970s",
    team: "Ferrari · McLaren", peak: "1975–1984",
    photo: "/drivers/lauda.jpg", car: "/cars/Lauda 1977.avif", teamColor: "#cc0000",
    pace: 93, quali: 91, racecraft: 94, wet: 85, tyres: 95, consistency: 96,
    titles: 3, wins: 25, poles: 24,
    quote: "I am not a superstar. I am just a racing driver.",
    bio: "Niki Lauda's story is one of the most extraordinary in sport. After nearly dying in the 1976 Nürburgring fire — suffering severe burns and inhaling toxic gases — he returned to racing just 42 days later and nearly retained his world title, losing it on the final lap of the final race. He then won a third championship in 1984, beating teammate Alain Prost by just half a point. Beyond the speed, he was a technical genius who helped build championship-winning cars.",
    facts: [{ k: "Championships", v: "3" }, { k: "Race Wins", v: "25" }, { k: "Pole Positions", v: "24" }, { k: "1976 Crash", v: "42 days out" }, { k: "Peak Year", v: "1984" }, { k: "Teams", v: "Ferrari · McLaren" }],
  },
  {
    key: "prost", name: "Alain Prost", country: "France", era: "1980s",
    team: "McLaren · Ferrari · Williams", peak: "1985–1993",
    photo: "/drivers/prost.jpeg", car: "/cars/Prost 1989.jpg", teamColor: "#c8102e",
    pace: 95, quali: 93, racecraft: 96, wet: 88, tyres: 97, consistency: 98,
    titles: 4, wins: 51, poles: 33,
    quote: "To finish first, first you have to finish.",
    bio: "Nicknamed 'The Professor', Alain Prost won four world championships across four different seasons with meticulous race management. He never chased poles he didn't need, saved tyres longer than anyone, and calculated fuel loads to the gram. His duels with Ayrton Senna — as teammates at McLaren and rivals across the paddock — defined an entire era of F1 and remains the sport's most celebrated rivalry.",
    facts: [{ k: "Championships", v: "4" }, { k: "Race Wins", v: "51" }, { k: "Pole Positions", v: "33" }, { k: "Fastest Laps", v: "41" }, { k: "Peak Year", v: "1989" }, { k: "Teams", v: "3 major" }],
    rationale: {
      pace: "95 — Quick but not flashy. Prost's pace came from smoothness and precision rather than the last-tenth heroics of Senna.",
      quali: "93 — Deliberately did not chase poles he didn't need. Often saved the car and tyres for Sunday.",
      racecraft: "96 — 'The Professor' — strategic mastery, fuel and tyre calculation, and race management were the best of his era.",
      wet: "88 — Known to dislike wet conditions and occasionally withdrew if he felt the risk was too high. Not a wet-weather star.",
      tyres: "97 — His smoothness meant he could run longer stints on harder compounds than anyone. A tyre management genius.",
      consistency: "98 — Four championships across three different teams. Highest career points per start of his generation. The definition of consistency.",
    },
  },
  {
    key: "senna", name: "Ayrton Senna", country: "Brazil", era: "1980s",
    team: "McLaren · Williams", peak: "1988–1991",
    photo: "/drivers/senna.jpg", car: "/cars/Senna 1991.webp", teamColor: "#c8102e",
    pace: 99, quali: 100, racecraft: 95, wet: 100, tyres: 88, consistency: 90,
    titles: 3, wins: 41, poles: 65,
    locked: true,
    unlockHint: "Run 4 simulations to unlock Senna",
    quote: "If you no longer go for a gap that exists, you're no longer a racing driver.",
    bio: "Ayrton Senna was more than a racing driver — he was a force of nature. His 65 pole positions remain one of F1's most extraordinary records. In qualifying, he entered a state he described as a trance, finding speed that baffled engineers and teammates alike. In the wet — at Estoril 1985, Monaco 1984, Donington 1993 — he was untouchable. He died at Imola in 1994 while leading, and the sport was never quite the same.",
    facts: [{ k: "Championships", v: "3" }, { k: "Race Wins", v: "41" }, { k: "Pole Positions", v: "65" }, { k: "Fastest Laps", v: "19" }, { k: "Peak Year", v: "1991" }, { k: "Monaco Wins", v: "6" }],
    rationale: {
      pace: "99 — Lap times in qualifying regularly baffled engineers. At Monaco 1988 he was 1.4s faster than his teammate on pure pace alone.",
      quali: "100 — 65 pole positions from 161 starts. His qualifying laps (Monaco 1984, Jerez 1990) are still studied as the ceiling of what a driver can extract from a car.",
      racecraft: "95 — Wheel-to-wheel instinct was extraordinary, though the 1989 and 1990 collisions with Prost show it occasionally crossed a line.",
      wet: "100 — Estoril 1985, Monaco 1984, Donington 1993. Every serious analyst ranks him the single greatest wet-weather driver in history.",
      tyres: "88 — Preferred to attack hard early and build a gap rather than nurse rubber. Not his primary weapon.",
      consistency: "90 — Mechanical failures and on-track controversies in title fights cost him points that pure consistency would have banked.",
    },
  },
  {
    key: "mansell", name: "Nigel Mansell", country: "United Kingdom", era: "1980s",
    team: "Williams · Ferrari", peak: "1986–1992",
    photo: "/drivers/mansell.jpeg", car: "/cars/Mansell 1992.avif", teamColor: "#003882",
    pace: 96, quali: 95, racecraft: 91, wet: 93, tyres: 89, consistency: 88,
    titles: 1, wins: 31, poles: 32,
    quote: "Anything is possible if you have enough nerve.",
    bio: "Nigel Mansell was the most theatrical driver of his era — all raw emotion, extraordinary pace, and occasional heartbreak. He lost the 1986 championship on the final corner of the final race when a tyre blew at 200mph. Six years later, in 1992, he dominated every session, winning the first five races and wrapping up the championship with five rounds to spare in the Williams FW14B. He then immediately left to win the CART IndyCar championship in America.",
    facts: [{ k: "Championships", v: "1" }, { k: "Race Wins", v: "31" }, { k: "Pole Positions", v: "32" }, { k: "Peak Year", v: "1992" }, { k: "First 5 Races", v: "All wins" }, { k: "CART Title", v: "1993" }],
    rationale: {
      pace: "96 — Raw, explosive pace. The 1992 Williams FW14B was built for his aggressive, high-downforce style and he extracted everything from it.",
      quali: "95 — 32 career poles. When the car was right he was blistering over a single lap.",
      racecraft: "91 — Thrilling to watch but occasionally over-aggressive — the Senna collision at Monaco 1992 is an example.",
      wet: "93 — Composed and fast in mixed conditions. Not a weakness, not a superpower.",
      tyres: "89 — His attacking style was hard on tyres, which cost him in longer stints and some title fights.",
      consistency: "88 — Stunning peak years but multiple seasons derailed by car failures, team disputes, and the occasional self-inflicted incident.",
    },
  },
  {
    key: "schumacher", name: "Michael Schumacher", country: "Germany", era: "2000s",
    team: "Ferrari", peak: "2002–2004",
    photo: "/drivers/schumacher.jpg", car: "/cars/Schumacher 2004.jpg", teamColor: "#cc0000",
    pace: 98, quali: 97, racecraft: 97, wet: 97, tyres: 96, consistency: 97,
    titles: 7, wins: 91, poles: 68,
    quote: "Records are one thing, but dreams are more important.",
    bio: "Michael Schumacher rewrote the record books. Seven world championships, 91 victories, 68 pole positions — numbers that seemed unreachable until Lewis Hamilton came along. But it was his 2004 season that defines the word dominance: 13 wins from 18 races, lapping the field at circuits where no one should lap the field. He was also the driver who turned F1 preparation and physical fitness into a full-time profession, raising the bar for every driver who followed.",
    facts: [{ k: "Championships", v: "7" }, { k: "Race Wins", v: "91" }, { k: "Pole Positions", v: "68" }, { k: "Fastest Laps", v: "77" }, { k: "Peak Year", v: "2004" }, { k: "Streak", v: "9 wins in a row" }],
    rationale: {
      pace: "98 — Could match anyone on raw pace and often saved it for when it mattered most rather than burning it in qualifying.",
      quali: "97 — 68 career pole positions. Not always the fastest single lap but clinical at maximising the car's potential.",
      racecraft: "97 — The complete tactical package: strategy, tyre calls, team management, and relentless pressure. Slight dock for team orders era.",
      wet: "97 — Spa 1994 (lapped the field), Nürburgring 1995, early Jordan drives. One of the truly elite wet-weather operators.",
      tyres: "96 — A pioneer of the aggressive in-lap/out-lap tyre strategy with Bridgestone. Made tyre management a weapon.",
      consistency: "97 — Seven championships. The 2000–2004 Ferrari run is the gold standard of sustained dominance across a team.",
    },
  },
  {
    key: "raikkonen", name: "Kimi Räikkönen", country: "Finland", era: "2000s",
    team: "McLaren · Ferrari · Lotus", peak: "2005–2007",
    photo: "/drivers/raikkonen.jpg", car: "/cars/Raikkonen 2007.jpg", teamColor: "#cc0000",
    pace: 96, quali: 94, racecraft: 92, wet: 95, tyres: 90, consistency: 87,
    titles: 1, wins: 21, poles: 18,
    quote: "Leave me alone, I know what I'm doing.",
    bio: "Kimi Räikkönen is perhaps the most naturally talented driver of his generation — and the least interested in talking about it. He won the 2007 title on the final lap of the final race, coming from 17 points behind Lewis Hamilton with two races to go. His ice-cool temperament, described by rivals as robotic in its calm, made him exceptional in difficult conditions.",
    facts: [{ k: "Championships", v: "1" }, { k: "Race Wins", v: "21" }, { k: "Pole Positions", v: "18" }, { k: "2007 Title", v: "Final lap drama" }, { k: "Peak Year", v: "2007" }, { k: "Nickname", v: "The Iceman" }],
    rationale: {
      pace: "96 — Naturally fast with minimal apparent effort. Outpaced Hamilton and Alonso at McLaren on raw speed in his early years.",
      quali: "94 — Not a consistent pole-sitter but capable of stunning single laps when motivated.",
      racecraft: "92 — Ice-cool race management and racecraft, but less aggressive overtaking than the true wheel-to-wheel greats.",
      wet: "95 — Several composed and impressive wet drives, including Spa performances that showed elite car control.",
      tyres: "90 — Good tyre feel but not the benchmark manager. His aggressive early-stint pace sometimes compromised deg.",
      consistency: "87 — The 2007 title was won dramatically but mid-career years at Lotus showed inconsistency.",
    },
  },
  {
    key: "alonso", name: "Fernando Alonso", country: "Spain", era: "2000s",
    team: "Renault · McLaren · Ferrari · Alpine", peak: "2005–2012",
    photo: "/drivers/alonso.jpg", car: "/cars/Alonso 2012.jpg", teamColor: "#e4002b",
    pace: 96, quali: 94, racecraft: 98, wet: 94, tyres: 96, consistency: 95,
    titles: 2, wins: 32, poles: 22,
    quote: "All the time you have to leave the space!",
    bio: "Fernando Alonso may be the greatest wheel-to-wheel racer in the modern era. His 2005 title as a 24-year-old ended Schumacher's five-year reign, and his 2012 Ferrari season — leading the championship for most of the year in a car that was arguably the fourth-fastest on the grid — is widely considered one of the greatest performances ever seen.",
    facts: [{ k: "Championships", v: "2" }, { k: "Race Wins", v: "32" }, { k: "Pole Positions", v: "22" }, { k: "Fastest Laps", v: "23" }, { k: "Peak Year", v: "2012" }, { k: "Le Mans", v: "2018 & 2019 wins" }],
    rationale: {
      pace: "96 — Elite raw pace. In 2012 he extracted results from the Ferrari that no other driver on the grid could have managed.",
      quali: "94 — Strong but not quite in the Senna/Hamilton bracket for pure single-lap extraction.",
      racecraft: "98 — Widely considered the greatest wheel-to-wheel racer of the modern era. His 2005–06 Renault racing was a masterclass.",
      wet: "94 — Several composed wet drives. Not the headline wet-weather legend but highly competent and rarely makes errors.",
      tyres: "96 — Can nurse tyres across impossible stints. His ability to manage deg in inferior cars kept him competitive for years.",
      consistency: "95 — Two championships, but mid-career years in poor machinery meant fewer results than his talent deserved.",
    },
  },
  {
    key: "hamilton", name: "Lewis Hamilton", country: "United Kingdom", era: "modern",
    team: "McLaren · Mercedes", peak: "2017–2020",
    photo: "/drivers/hamilton.jpg", car: "/cars/Hamilton 2020.avif", teamColor: "#848484",
    pace: 97, quali: 98, racecraft: 96, wet: 96, tyres: 95, consistency: 97,
    titles: 7, wins: 103, poles: 104,
    quote: "Still I Rise.",
    bio: "Lewis Hamilton rewrote every record Schumacher held. 104 pole positions — more than any driver in history. 103 victories. Seven world championships, equalling the all-time record. But statistics don't capture what made him special: the ability to produce a perfect lap when everything was on the line, drive through the field in the wet with an authority that recalled Senna, and maintain elite-level performance across three different generations of regulation changes.",
    facts: [{ k: "Championships", v: "7" }, { k: "Race Wins", v: "103" }, { k: "Pole Positions", v: "104" }, { k: "Fastest Laps", v: "67" }, { k: "Peak Year", v: "2020" }, { k: "Win Rate", v: "35%" }],
    rationale: {
      pace: "97 — Raw pace matched or exceeded his teammates in nearly every season. Slightly below Senna and Verstappen's peak single-lap ceiling.",
      quali: "98 — 104 pole positions — the most in history. Consistently extracts the last tenth when it counts.",
      racecraft: "96 — Brilliant at overtaking and reading a race. Slight dock versus peak Senna/Verstappen for wheel-to-wheel aggression.",
      wet: "96 — Canada 2011 (from last to victory), Silverstone 2008, multiple stunning wet drives. One of the modern greats in the rain.",
      tyres: "95 — Excellent tyre management, particularly in the Mercedes hybrid era where managing deg across a stint was crucial.",
      consistency: "97 — Seven championships tied with Schumacher. Only failed to win the title once (2021, lost on the final lap in controversial circumstances).",
    },
  },
  {
    key: "vettel", name: "Sebastian Vettel", country: "Germany", era: "2000s",
    team: "Red Bull · Ferrari", peak: "2010–2013",
    photo: "/drivers/vettel.jpg", car: "/cars/Vettel 2013.webp", teamColor: "#1e4796",
    pace: 96, quali: 97, racecraft: 90, wet: 90, tyres: 91, consistency: 93,
    titles: 4, wins: 53, poles: 57,
    quote: "Everyone is a Ferrari fan.",
    bio: "Sebastian Vettel won four consecutive world championships between 2010 and 2013, and his 2013 season was a display of ruthless dominance — nine consecutive race victories to end the year, the longest winning streak in F1 history. In the right machinery, his qualifying pace was among the best the sport has ever seen.",
    facts: [{ k: "Championships", v: "4" }, { k: "Race Wins", v: "53" }, { k: "Pole Positions", v: "57" }, { k: "Fastest Laps", v: "38" }, { k: "Peak Year", v: "2013" }, { k: "Win Streak", v: "9 races" }],
    rationale: {
      pace: "96 — Blisteringly fast in the right machinery. The 2013 Red Bull was built around his ability to generate downforce through his driving style.",
      quali: "97 — 57 career pole positions. His qualifying pace in the dominant Red Bull years was exceptional.",
      racecraft: "90 — Dominant when out front but less convincing in close wheel-to-wheel combat. Turkey 2010 and Baku incidents are examples.",
      wet: "90 — Competent in the wet but not a specialist. Several errors in mixed conditions throughout his career.",
      tyres: "91 — His 2013 downforce-reliant style worked brilliantly but struggled when tyre management became the differentiator.",
      consistency: "93 — Four consecutive championships, but Ferrari years showed inconsistency under pressure that cost him title fights.",
    },
  },
  {
    key: "button", name: "Jenson Button", country: "United Kingdom", era: "2000s",
    team: "Brawn GP · McLaren", peak: "2009",
    photo: "/drivers/button.jpg", car: "/cars/Button 2009.avif", teamColor: "#a8d400",
    pace: 91, quali: 90, racecraft: 94, wet: 97, tyres: 98, consistency: 93,
    titles: 1, wins: 15, poles: 8,
    quote: "You don't learn by winning. You learn by losing.",
    bio: "Jenson Button's 2009 season was one of the most improbable championship victories in F1 history. His team — Brawn GP — had nearly folded when Honda withdrew from F1 at the end of 2008. Ross Brawn bought the team for a nominal sum, ran the 2009 car they'd already built, and won the constructors' AND drivers' championships at the first attempt.",
    facts: [{ k: "Championships", v: "1" }, { k: "Race Wins", v: "15" }, { k: "Pole Positions", v: "8" }, { k: "First 7 Races", v: "6 wins" }, { k: "Peak Year", v: "2009" }, { k: "Team", v: "Brawn GP" }],
  },
  {
    key: "hakkinen", name: "Mika Häkkinen", country: "Finland", era: "1990s",
    team: "McLaren", peak: "1998–1999",
    photo: "/drivers/hakkinen.jpg", car: "/cars/Hakkinen 1998.avif", teamColor: "#5a5a5a",
    pace: 97, quali: 96, racecraft: 93, wet: 91, tyres: 92, consistency: 91,
    titles: 2, wins: 20, poles: 26,
    quote: "You cannot overtake fifteen cars in sunny weather... but you can when it's raining.",
    bio: "Mika Häkkinen was the driver that Ayrton Senna genuinely feared — he told Ron Dennis so. Back-to-back world champion in 1998 and 1999, he outpaced teammate David Coulthard by enormous margins in identical machinery. His Monza 1999 overtake on Michael Schumacher — a perfectly timed dummy at the chicane — is one of the iconic overtaking moves in F1 history.",
    facts: [{ k: "Championships", v: "2" }, { k: "Race Wins", v: "20" }, { k: "Pole Positions", v: "26" }, { k: "Peak Year", v: "1998" }, { k: "Team", v: "McLaren only" }, { k: "Senna feared", v: "Confirmed" }],
    rationale: {
      pace: "97 — Senna told Ron Dennis that Häkkinen was the only driver who genuinely scared him on raw pace. Back-to-back champion in identical machinery.",
      quali: "96 — 26 pole positions at McLaren. Outqualified Coulthard comprehensively across their seasons together.",
      racecraft: "93 — The Monza 1999 dummy on Schumacher is one of the great overtaking moves. Good but not on Alonso's wheel-to-wheel level.",
      wet: "91 — Capable in the wet but not a specialist. His strength was supreme pace in dry conditions.",
      tyres: "92 — Smooth enough to manage tyres well, though not the benchmark tyre strategist of his era.",
      consistency: "91 — Back-to-back titles but reliability issues and Schumacher pressure meant no dominant championship streak.",
    },
  },
  {
    key: "verstappen", name: "Max Verstappen", country: "Netherlands", era: "modern",
    team: "Red Bull", peak: "2021–2023",
    photo: "/drivers/verstappen.jpeg", car: "/cars/Verstappen 2023.avif", teamColor: "#1e4796",
    pace: 99, quali: 97, racecraft: 99, wet: 97, tyres: 92, consistency: 96,
    titles: 4, wins: 62, poles: 40,
    quote: "Simply lovely.",
    bio: "Max Verstappen arrived in F1 at 17 and scored a victory in his very first race for Red Bull in Spain 2016. By 2023, he had won 19 races in a single season — the most victories in a single F1 season ever. His wheel-to-wheel racing is the best of his generation: aggressive, precise, and utterly fearless. His four consecutive championships from 2021–2024 place him in the conversation for the greatest of all time.",
    facts: [{ k: "Championships", v: "4" }, { k: "Race Wins", v: "62+" }, { k: "Pole Positions", v: "40+" }, { k: "2023 Season", v: "19 wins" }, { k: "Peak Year", v: "2023" }, { k: "Debut age", v: "17" }],
    rationale: {
      pace: "99 — His qualifying pace is generational. In 2023 he produced laps that left the entire grid half a second behind on identical compounds.",
      quali: "97 — Consistently at the front but occasionally outqualified by Leclerc and Norris on pure single-lap pace in a slower car.",
      racecraft: "99 — Wheel-to-wheel is his defining superpower. The 2021 season showed he can fight anyone, anywhere, without blinking.",
      wet: "97 — Brazil 2021 (from last, overtook Hamilton in 3 laps), Spa 2022, multiple dominant wet sessions.",
      tyres: "92 — Early career was notably aggressive on tyres. Has improved significantly but not yet at the Prost/Button benchmark.",
      consistency: "96 — 19 wins in a single season (2023). Dropped a point for the occasional mechanical DNF and early-career aggressive tyre wear.",
    },
  },
  {
    key: "leclerc", name: "Charles Leclerc", country: "Monaco", era: "modern",
    team: "Ferrari", peak: "2019–2024",
    photo: "/drivers/leclrec.jpg", car: "/cars/Leclrec 2024.jpeg", teamColor: "#cc0000",
    pace: 97, quali: 98, racecraft: 91, wet: 95, tyres: 89, consistency: 88,
    titles: 0, wins: 8, poles: 24,
    quote: "Just an inchident.",
    bio: "Charles Leclerc announced himself to the world with back-to-back victories at Spa and Monza in 2019. Since then, his qualifying pace has been consistently rated among the two or three best on the grid. He finally won the Monaco Grand Prix in 2024, ending a personal jinx at his home race. Still only in his mid-twenties, his best years are ahead of him.",
    facts: [{ k: "Championships", v: "0" }, { k: "Race Wins", v: "8" }, { k: "Pole Positions", v: "24+" }, { k: "Monaco Win", v: "2024" }, { k: "Debut team", v: "Sauber" }, { k: "Ferrari since", v: "2019" }],
  },
  {
    key: "villeneuve", name: "Gilles Villeneuve", country: "Canada", era: "1970s",
    team: "Ferrari", peak: "1979–1981",
    photo: "/drivers/villeneuve.jpg", car: "/cars/Vileneuve 1979.jpg", teamColor: "#cc0000",
    pace: 97, quali: 93, racecraft: 96, wet: 94, tyres: 84, consistency: 82,
    titles: 0, wins: 6, poles: 2,
    quote: "If you're going to do something, do it properly.",
    bio: "Gilles Villeneuve never won a world championship, but his legacy towers over many who did. At the 1981 Spanish Grand Prix, he held five faster cars behind him for the entire race on tyres that were completely destroyed — one of the most extraordinary displays of racecraft ever seen. Senna called him his hero.",
    facts: [{ k: "Championships", v: "0" }, { k: "Race Wins", v: "6" }, { k: "Pole Positions", v: "2" }, { k: "Peak Year", v: "1979" }, { k: "Hero of", v: "Senna" }, { k: "Career end", v: "1982" }],
  },
  {
    key: "ascari", name: "Alberto Ascari", country: "Italy", era: "1950s",
    team: "Ferrari", peak: "1952–1953",
    photo: "/drivers/ascari.jpeg", car: "/cars/ascari 1952.webp", teamColor: "#cc0000",
    pace: 92, quali: 90, racecraft: 92, wet: 88, tyres: 85, consistency: 90,
    titles: 2, wins: 13, poles: 14,
    quote: "Racing is life. Everything before and after is just waiting.",
    bio: "Alberto Ascari won back-to-back world championships in 1952 and 1953 at a time when Ferrari was the dominant force in Formula 1. He was the first Italian world champion and the first to win consecutive titles. His win rate of 40% across his championship years was exceptional for the era.",
    facts: [{ k: "Championships", v: "2" }, { k: "Race Wins", v: "13" }, { k: "Pole Positions", v: "14" }, { k: "Win Rate", v: "40%" }, { k: "Peak Year", v: "1952" }, { k: "Team", v: "Ferrari" }],
  },
];

export const GOAT_DRIVERS = DRIVERS.filter(d =>
  ["senna","schumacher","hamilton","verstappen","prost","alonso","clark","fangio","lauda","vettel","hakkinen","mansell","raikkonen","leclerc","button","stewart","moss","villeneuve"].includes(d.key)
);

// 8 drivers that must be unlocked by running simulations
export const LOCKED_DRIVER_KEYS = new Set([
  "verstappen","senna","leclerc","clark","fangio","lauda","stewart","button"
]);

// Unlock order: each key unlocks after this many total simulations
export const UNLOCK_THRESHOLDS: Record<string, number> = {
  lauda:      3,
  clark:      6,
  fangio:     9,
  stewart:    12,
  button:     15,
  leclerc:    18,
  senna:      21,
  verstappen: 24,
};
