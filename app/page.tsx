'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

// 👇 ABOVE all components (same level as getTodayStr)
const generateHabitLogs = async () => {
  const today = new Date()

  const { data: habits } = await supabase
    .from('habits')
    .select('*')

  if (!habits) return

  for (const habit of habits) {
    if (!habit.start_date) continue

    const startDate = new Date(habit.start_date)
    let current = new Date(startDate)

    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0]
      const weekday = current.getDay()

      let isDue = false

      if (habit.frequency_type === 'daily') isDue = true

      if (habit.frequency_type === 'weekly') {
        isDue = habit.weekday === weekday
      }

      if (habit.frequency_type === 'interval') {
        const diff = Math.floor(
          (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        isDue = diff >= 0 && diff % habit.interval_days === 0
      }

      if (!isDue) {
        current.setDate(current.getDate() + 1)
        continue
      }

      const { data: existing } = await supabase
        .from('habit_logs')
        .select('id')
        .eq('habit_id', habit.id)
        .eq('log_date', dateStr)

      if (!existing || existing.length === 0) {
        await supabase.from('habit_logs').insert([
          {
            habit_id: habit.id,
            log_date: dateStr,
            completed: false
          }
        ])
      }

      current.setDate(current.getDate() + 1)
    }
  }
}

const DEFAULT_START = '2026-01-01'

const getTodayStr = () => {
  const today = new Date()
  return `${today.getFullYear()}-${
    String(today.getMonth() + 1).padStart(2, '0')
  }-${String(today.getDate()).padStart(2, '0')}`
}
const getTomorrowStr = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)

  return `${d.getFullYear()}-${
    String(d.getMonth() + 1).padStart(2, '0')
  }-${String(d.getDate()).padStart(2, '0')}`
}
const headerStyle = (color: string) => ({
  background: color,
  color: 'white',
  padding: '10px 12px',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  fontWeight: 600,
})

const quotes = [
"Bitterness is like a cancer that enters the soul.— Sir Terry Waite",
"The true test of character is not how much we know how to do, but how we behave when we don’t know what to do.— John Holt",
"It’s better to be at the bottom of a ladder you want to climb than halfway up one you don’t.—Ricky Gervais",
"The biggest temptation is to settle for too little.— Thomas Merton",
"Everybody wants to be famous, but nobody wants to do the work. I live by that. You grind hard so you can play hard. At the end of the day, you put all the work in, and eventually it’ll pay off. It could be in a year, it could be in 30 years. Eventually, your hard work will pay off.— Michael Hart",
"Every action you take is a vote for the type of person you wish to become.— James Clear",
"You pray for the hungry. Then you feed them. That’s how prayer works.—Pope Francis",
"I would like to show the world today as an ant sees it, and tomorrow as the moon sees it.—Hannah Hoch",
"Write this down, young man. Life has been extremely, I say extremely, kind.— Margaret Gorman",
"What you are, you are by accident of birth; what I am, I am by myself.— Ludwig van Beethoven",
"Never allow a person to tell you no who doesn’t have the power to say yes.—Eleanor Roosevelt",
"When I hear somebody sigh, ‘Life is hard,’ I am always tempted to ask, ‘Compared to what?'—Sydney J. Harris",
"If you do every job like you’re going to do it for the rest of your life, that’s when you get noticed.—Mary Barra",
"Anyone who has spent any time in space will love it for the rest of their lives. I achieved my childhood dream of the sky.— Valentina Tereshkova",
"Your messaging should convey, ‘Here’s why you would be so lucky if you got me,’ instead of ‘I really wanted it,’ which we all tend to do.—Barbara Corcoran",
"I know you’ve heard it a thousand times before. But it’s true— hard work pays off. If you want to be good, you have to practice, practice, practice. If you don’t love something, then don’t do it.—Ray Bradbury",
"All medicine is like that. It came from someone who dared.— Dr. William DeVries",
"The American city should be a collection of communities where every member has a right to belong. It should be a place where every man feels safe on his streets and in the house of his friends.— Lyndon Johnson",
"I knew all the rules but the rules did not know me.— Eddie Vedder",
"It was the first evidence to me that we’d changed the world.— John Shepherd-Barron",
"The things that scare you only make you better and stronger.—Octavia Spencer",
"The more I want to get something done, the less I call it work.— Richard Bach",
"It’s a hard, lonely feeling, to be completely yourself in front of strangers.— Michael Che",
"The first step is clearly defining what it is you’re after, because without knowing that, you’ll never get it.— Halle Berry",
"Take the opportunity to learn from your mistakes: find the cause of your problem and eliminate it. Don’t try to be perfect; just be an excellent example of being human.— Tony Robbins",
"I’m not the next Usain Bolt or Michael Phelps … I’m the first Simone Biles.—Simone Biles",
"My mother thinks I am the best. And I was raised to always believe what my mother tells me— Diego Maradona",
"You would be amazed what the ordinary guy knows.—Matt Drudge",
"You are never too good for anything. Always be willing to do everything.— Thomas Parkinson",
"Do as much homework as you can. Learn everybody’s job and don’t just settle.—Michael B. Jordan",
"Those who don’t believe in magic will never find it.— Roald Dahl",
"There is no such thing as accident; it is fate misnamed.— Napoleon Bonaparte",
"The function of leadership is to produce more leaders, not more followers.—Ralph Nader",
"You can overcome anything, if and only if you love something enough— Lionel Messi",
"God works a miracle— William Bradford",
"The man who moves a mountain begins by carrying away small stones.— Confucius",
"To make others less happy is a crime. To make ourselves unhappy is where all crime starts.— Roger Ebert",
"Opportunities multiply as they are seized.—Sun Tzu",
"People who think they know everything are a great annoyance to those of us who do.— Isaac Asimov",
"Give me a place to stand, and a lever long enough, and I will move the world.—Archimedes",
"People will forget what you said, people will forget what you did, but people will never forget how you made them feel.— Maya Angelou",
"I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.—Alexander the Great",
"We’re born alone. We do need each other. It’s lonely to really effectively live your life, and anyone you can get help from or give help to, that’s part of your obligation.—Bill Murray",
"Failure is a badge of honor. It means you risked failure. And if you don’t risk failure, you’re never going to do anything that’s different from what you’ve already done or what somebody else has done.—Charlie Kaufman",
"This is not just a job. This is a passion. Connecting people, connecting the world, making a difference. How many jobs can say I made the world better today? We do that every single day.—Ed Bastian",
"A delayed game is eventually good, but a rushed game is forever bad.— Shigeru Miyamoto",
"It’s a gift to exist, and with existence comes suffering. There’s no escaping that.—Stephen Colbert",
"I believe ambition is not a dirty word. It’s just believing in yourself and your abilities. Imagine this: What would happen if we were all brave enough to be a little bit more ambitious? I think the world would change.— Reese Witherspoon",
"Certain things in life are more important than the usual crap that everyone strives for.— James Taylor",
"Logic will get you from A to B. Imagination will take you everywhere.— Albert Einstein",
"If you feel safe in the area you’re working in, you’re not working in the right area. Always go a little further into the water than you feel you’re capable of being in. Go a little bit out of your depth. And when you don’t feel that your feet are quite touching the bottom, you’re just about in the right place to do something exciting.— David Bowie",
"If you can’t fail, you can never get better.— Benedict Cumberbatch",
"It took me a long time not to judge myself through someone else’s eyes.—Sally Field",
"The best protection any woman can have … is courage.—Elizabeth Cady Stanton",
"I have captured the light and arrested its flight. The sun itself shall draw my pictures.— Louis Daguerre",
"It’s beautiful when you watch something good happen to somebody when it’s well deserved.— Jennifer Lawrence",
"You can’t teach anybody anything, only make them realize the answers are already inside them.— Galileo Galilei",
"Talk sense to a fool and he calls you foolish.—Euripides",
"If you love what you do and are willing to do what it takes, it’s within your reach.— Steve Wozniak",
"Troubles are often the tools by which God fashions us for better things.—Henry Ward Beecher",
"To love means loving the unlovable. To forgive means pardoning the unpardonable. Faith means believing the unbelievable. Hope means hoping when everything seems hopeless.—Gilbert K. Chesterton",
"The world promises you comfort, but you were not made for comfort. You were made for greatness.— Pope Benedict XVI",
"Memory is original events combined with every other time you’ve remembered that event. This is why therapy’s helpful.—Becky Kennedy",
"If opportunity doesn’t knock, build a door.— Milton Berle",
"It’s easy to fool the eye but it’s hard to fool the heart.— Al Pacino",
"It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.—Charles Darwin",
"Success is getting what you want. Happiness is wanting what you get.—Ingrid Bergman",
"You are on the eve of a complete victory. You can’t go wrong. The world is behind you.—Josephine Baker",
"Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.— Anonymous",
"Criticism is something we can avoid easily by saying nothing, doing nothing, and being nothing.— Aristotle",
"Don’t let what you don’t know scare you, because it can become your greatest asset. And if you do things without knowing how they have always been done, you’re guaranteed to do them differently.— Sara Blakely",
"An innovation will get traction only if it helps people get something that they’re already doing in their lives done better.—Clayton Christensen",
"Nursing encompasses an art, a humanistic orientation, a feeling for the value of the individual, and an intuitive sense of ethics, and of the appropriateness of action taken.— Myrtle Aydelotte",
"It seems to me that to be peaceful and content, you don’t have to know precisely what you want. It may even be better if you don’t. But I think you do need to be very clear what you DON’T want, and steadfast in the not-doing of those things.—Sandra Boynton",
"It was the ultimate dream. But the idea of a young black American like me owning a Cadillac? It seemed too far-fetched.— Dick Gidron",
"You are a Universe of Universes And your Soul a source of Songs.— Ruben Dario",
"Don’t live the same year 75 times and call it a life.—Robin Sharma",
"If there is no struggle, there is no progress.— Frederick Douglas",
"Think about me every now and then, old friend.— John Lennon",
"We must never be afraid to go too far, for success lies just beyond.— Marcel Proust",
"There is no list of rules. There is one rule. The rule is: There are no rules.—Shonda Rhimes",
"I would rather have one article a day of this sort; and these 10 or 20 lines might readily represent a whole day’s hard work in the way of concentrated, intense thinking and revision, polish of style, weighing of words.—Joseph Pulitzer",
"Winners are the ones who really listen to the truth of their hearts.— Sylvester Stalone",
"With everything that has happened to you, you can either feel sorry for yourself or treat what has happened as a gift. Everything is either an opportunity to grow or an obstacle to keep you from growing. You get to choose.— Wayne Dyer",
"If you’re too rigid in your thinking you may miss some wonderful opportunities for storytelling.— Vince Gilligan",
"Education is not the filling of a pail, but the lighting of a fire.— William Butler Yeats",
"Before you can make a dream come true, you must first have one.— Ronald McNair",
"Business is built on relationships, relationships are built on trust, and the foundation of trust is honesty.—Various",
"Far better is it to dare mighty things, to win glorious triumphs, even though checkered by failure, than to rank with those poor spirits who neither enjoy much nor suffer much, because they live in a gray twilight that knows not victory nor defeat.—Theodore Roosevelt",
"What we do is more important than what we say or what we say we believe.—bell hooks",
"Sometimes all you need is 20 seconds of insane courage—Matt Damon",
"Be passionate and bold. Always keep learning. You stop doing useful things if you don’t learn.—Satya Nadella",
"The chief cause of failure is substituting what you want most for what you want now.—Zig Ziglar",
"If you know exactly what you want to be, you need to spend as much time as possible with people who are actually that already.—Gary Vaynerchuk",
"You never know what worse luck your bad luck has saved you from.—Cormac McCarthy",
"Leadership is the art of getting someone else to do something you want done because he wants to do it.—Dwight Eisenhower",
"If it wasn’t hard, everyone would do it. It’s the hard that makes it great.—Tom Hanks",
"Sometimes your mistakes are you biggest virtues. You learn so much from the mistake. Those things that you think are the worst thing that’s happening to you can somehow turn around and be the greatest opportunity.—Nicole Kidman",
"Get into what your kids are into. How miserable would it be to always be anti-popular stuff like ‘ughhhh you seriously like Taylor Swift?'—Joel Willis",
"Life is not easy for any of us. But what of that? We must have perseverance and, above all, confidence in ourselves. We must believe we are gifted for something and that this thing must be attained.—Marie Curie",
"We hold our heads high, despite the price we have paid, because freedom is priceless.—Lech Walesa",
"It’s always better to shock people and change people’s expectations than to give them exactly what they think you can do.—Jonah Hill",
"I think happiness is overrated. Satisfied, at peace-those would be more realistic goals.— Brad Pitt",
"It is not very often that an opportunity comes knocking. But when it does, you’d better be bathed and dressed and ready to answer its call.—Jyoti Arora",
"To understand the heart and mind of a person, look not at what he has already achieved, but at what he aspires to do.—Kahlil Gibran",
"Diligence is the mother of good luck.— Benjamin Franklin",
"The rung of a ladder was never meant to rest upon, but only to hold a man’s foot long enough to enable him to put the other somewhat higher.— Thomas Huxley",
"Thousands of candles can be lighted from a single candle. Happiness never decreases by being shared.— Gautama Buddha",
"It’s hard work to make a four-minute program look effortless and elegant.— Katarina Witt",
"I would rather five people knew my work and thought it was good work than five million knew me and were indifferent.— Colin Firth",
"Someday is not a day of the week.—Janet Dailey",
"If everything seems under control, you’re not going fast enough.—Mario Andretti",
"An important attribute of success is to be yourself. Never hide what makes you, you.— Indra Nooyi",
"What is harder than rock, or softer than water? Yet soft water hollows out hard rock. Persevere.—Ovid",
"My pain may be the reason for somebody’s laugh. But my laugh must never be the reason for somebody’s pain.— Charlie Chaplin",
"Don’t worry about failure; you only have to be right once.— Drew Houston",
"A lot of times, people look at the negative side of what they feel they can’t do. I always look on the positive side of what I can do.— Chuck Norris",
"I tend to think you’re fearless when you recognize why you should be scared of things, but do them anyway.—Christian Bale",
"Success … is built on the foundation of courage, hard work and individual responsibility. Despite what some would have us believe, success is not built on resentment and fears.— Susana Martinez",
"I’ve been absolutely terrified every moment of my life— and I’ve never let it keep me from doing a single thing I wanted to do.—Georgia O’Keeffe",
"I practice my saxophone three hours a day. I’m not saying I’m particularly special, but if you do something three hours a day for forty years, you get pretty good at it.— Kenny G",
"Smooth seas do not make skillful sailors.— African proverb",
"I know the price of success: dedication, hard work and an unremitting devotion to the things you want to see happen.— Frank Lloyd Wright",
"I think one day you’ll find that you’re the hero you’ve been looking for.—Jimmy Stewart",
"If all I do in my life is soothe someone’s spirit with a song , then let me do that and I’m happy.— Gladys Knight",
"Life becomes easier when you learn to accept the apology you never got.—R. Brault",
"There are times in all of our lives when a reliance on gut or intuition just seems more appropriate when a particular course of action just feels right. And, interestingly I’ve discovered it’s in facing life’s most important decisions that intuition seems the most indispensable.—Tim Cook",
"All labor that uplifts humanity has dignity and importance.— Martin Luther King Jr.",
"You may think using Google’s great, but I still think it’s terrible.— Larry Page",
"It’s tough to get out of bed to do roadwork at 5 a.m. when you’ve been sleeping in silk pajamas.—Marvin Hagler",
"There is no security on the Earth, there is only opportunity.— Douglas MacArthur",
"Everyone’s like, ‘overnight sensation.’ It’s not overnight. It’s years of hard work.—Margot Robbie",
"The worth of a life is not determined by a single failure or a solitary success.— Kevin Kline",
"When we are no longer able to change a situation— we are challenged to change ourselves.—Viktor E. Frankl",
"Only the weak are cruel. Gentleness can only be expected from the strong.— Leo Buscaglia",
"For small creatures such as we, the vastness is bearable only through love.— Carl Sagan",
"Build something 100 people love, not something 1 million people kind of like.— Brian Chesky",
"Once you replace negative thoughts with positive ones, you’ll start having positive results.— Willie Nelson",
"Don’t write what you think people want to read. Find your voice and write about what’s in your heart.— Quentin Tarantino",
"Life is what we make it, always has been, always will be.— Grandma Moses",
"There is overwhelming evidence that the higher the level of self-esteem, the more likely one will be to treat others with respect, kindness, and generosity.— Nathaniel Branden",
"It’s a good place when all you have is hope and not expectations.— Danny Boyle",
"Good things come to obsessive compulsives who fixate.—Kieran Culkin",
"It is easier to build strong children than to repair broken men.—Frederick Douglass",
"You can’t be afraid of what people are going to say, because you’re never going to make everyone happy.—Selena Gomez",
"Waking up in truth is so much better than living in a lie.—Idris Elba",
"Instead of looking at the past, I put myself ahead 20 years and try to look at what I need to do now in order to get there then.—Diana Ross",
"People seldom do what they believe in. They do what is convenient, and then repent.—Bob Dylan",
"Everybody wants to be famous, but nobody wants to do the work. I live by that. You grind hard so you can play hard. At the end of the day, you put all the work in, and eventually it’ll pay off. It could be in a year, it could be in 30 years. Eventually, your hard work will pay off.—Kevin Hart",
"Anything in life worth having is worth working for.— Andrew Carnegie",
"Life is short, and the world is wide.— Simon Raven",
"I felt that one had better die fighting against injustice than to die like a dog or rat in a trap. I had already determined to sell my life as dearly as possible if attacked. I felt if I could take one lyncher with me, this would even up the score a little bit.—Ida B. Wells",
"There are two ways of spreading light: to be the candle or the mirror that reflects it.—Edith Wharton",
"How old would you be if you didn’t know how old you are?— Satchel Paige",
"When you find an idea that you just can’t stop thinking about, that’s probably a good one to pursue.—Josh James",
"We each come by the gifts we have to offer by an infinite series of influences and lucky breaks we can never fully understand.—MacKenzie Scott",
"Everyone thinks of changing the world, but no one thinks of changing himself.— Leo Tolstoy",
"Economics is like the Dutch language. I’m told it makes sense, but I have my doubts.—John Oliver",
"Ultimately, you just have one life. You never know unless you try. And you never get anywhere unless you ask.— Kate Winslet",
"We are all ordinary. We are all boring. We are all spectacular. We are all shy. We are all bold. We are all heroes. We are all helpless. It just depends on the day.—Brad Meltzer",
"Think of how stupid the average person is, and realize half of them are stupider than that.— George Carlin",
"Some of the world’s greatest feats were accomplished by people not smart enough to know they were impossible.— Doug Larson",
"Take wrong turns. Talk to strangers. Open unmarked doors. And if you see a group of people in a field, go find out what they are doing. Do things without always knowing how they’ll turn out.—Randall Munroe",
"I’m intimidated by the fear of being average.— Taylor Swift",
"Always be a first-rate version of yourself instead of a second-rate version of somebody else.—Judy Garland",
"The history of the world is the history of a few people who had faith in themselves.— Swami Vivekananda",
"The one thing you’re most reluctant to tell. That’s where the comedy is.— Mike Birbiglia",
"Doubt is a killer. You just have to know who you are and what you stand for.— Jennifer Lopez",
"Basically, the first half of life is writing the text, and the second half is writing the commentary on that text.—Richard Rohr",
"Great artists steal’ is … about finding inspiration in the work of others, then using it as a starting point for original creative output.— Adam J. Kurtz",
"Don’t count the days, make the days count.—Muhammad Ali",
"You must not only aim right, but draw the bow with all your might.— Henry David Thoreau",
"Your days are numbered. Use them to throw open the windows of your soul to the sun. If you do not, the sun will soon set, and you with it.—Marcus Aurelius",
"I have already lost touch with a couple of people I used to be.—Joan Didion",
"Fear of looking stupid is the No. 1 killer of dreams. The worst part? The people who make you feel stupid are usually the ones least qualified to judge someone else’s life.—Anthony Moore",
"I’ve grown most not from victories but from setbacks. If winning is God’s reward, then losing is how he teaches us.—Serena Williams",
"Life is 10 percent what happens to me and 90 percent of how I react to it.— Charles Swindoll",
"A successful man is one who can lay a firm foundation with the bricks others have thrown at him.— David Brinkley",
"I don’t know what the future may hold, but I know who holds the future.—Ralph Abernathy",
"People always fall in love with the most perfect aspects of each other’s personalities. Who wouldn’t? Anybody can love the most wonderful parts of another person. But that’s not the clever trick. The really clever trick is this: Can you accept the flaws?—Elizabeth Gilbert",
"Being an optimist after you’ve got the very thing you want doesn’t count.— Ken Hubbard",
"I can say the willingness to get dirty has always defined us as an nation, and it’s a hallmark of hard work and a hallmark of fun, and dirt is not the enemy.— Mike Rowe",
"I’ll tell you what bravery really is. Bravery is just determination to do a job that you know has to be done.—Audie Murphy",
"Always look for the fool in the deal. If you don’t find one, it’s you.— Mark Cuban",
"If everyone is thinking alike, then somebody isn’t thinking.—General George S. Patton",
"No matter what people tell you, words and ideas can change the world.— Robin Williams",
"Philosophy is like trying to open a safe with a combination lock: each little adjustment of the dials seems to achieve nothing, only when everything is in place does the door open.— Ludwig Wittgenstein",
"I am not a product of my circumstances. I am a product of my decisions.—Stephen Covey",
"Victory has a hundred fathers and defeat is an orphan.— John F. Kennedy",
"If you hear the dogs, keep going. If you see the torches in the woods, keep going. If there’s shouting after you, keep going. Don’t ever stop. Keep going. If you want a taste of freedom, keep going.— Araminta Ross (later known as Harriet Tubman)",
"Art, in itself, is an attempt to bring order out of chaos.—Stephen Sondheim",
"Reality is created by the mind; we can change our reality by changing our mind.—Plato",
"Grant me courage to serve others; For in service there is true life.—Cesar Chavez",
"Anyone with two tunics should share with him who has none.— John the Baptist",
"A pessimist sees the difficulty in every opportunity; an optimist sees the opportunity in every difficulty.— Sir Winston Churchill",
"What I’ve learned from running is that the time to push hard is when you’re hurting like crazy and you want to give up. Success is often just around the corner.—James Dyson",
"Do you really want to look back on your life and see how wonderful it could have been had you not been afraid to live it?—Caroline Myss",
"The secret of a happy marriage is finding the right person. You know they’re right if you love to be with them all the time.—Julia Child",
"Flaming enthusiasm, backed by horse-sense and persistence, is the quality that most frequently makes for success.— Dale Carnegie",
"God loves us beyond comprehension, and we cannot diminish God’s love for us.— Saint Peter",
"What gets celebrated gets replicated.— Bradley Cooper",
"The best way to predict the future is to invent it.— Alan Kay",
"Everyone you meet in life is fighting a battle you know nothing about.—Unknown original",
"If you look around the room, and you’re the smartest person in the room, you’re in the wrong room.— Lorne Michaels",
"Being polite and grateful will make people more inclined to help you. And if people are willing to help you, you may accidentally get something you want.— Jason Sudeikis",
"If people knew how hard I worked to achieve my mastery, it wouldn’t seem so wonderful after all.— Michaelengo",
"If you want to change who you are, you have to change what you do.—Jude Law",
"The best time to plant a tree was 20 years ago. The second best time is now.— Anonymous",
"Bridge the age gap. For younger people, find a way to spend time with older people. For the more silver-haired among us, I’m telling you: Find a few things the young kids are into — music, tech, sports — and check them out.—Mike Erwin",
"I’m not afraid of storms, for I’m learning how to sail my ship.—Mary Louise Alcott",
"Today a reader, tomorrow a leader.— Margaret Fuller",
"Freedom lies in being bold.—Robert Frost",
"I will take the subway and look at certain women and think ‘God, that woman’s story will never be told. How come that lady doesn’t get a movie about her?— Natasha Lyonne",
"If you focus on results you’ll never change. If you focus on change, you’ll get results.— Jack Dixon",
"Empty your mind, be formless. Shapeless, like water. If you put water into a cup, it becomes the cup. You put water into a bottle and it becomes the bottle. You put it in a teapot it becomes the teapot. Now, water can flow or it can crash. Be water, my friend.— Bruce Lee",
"Complexity kills. It sucks the life out of developers, it makes products difficult to plan, build and test, it introduces security challenges, and it causes end-user and administrator frustration.— Ray Ozzie",
"When one door closes another door opens; but we so often look so long and so regretfully upon the closed door, that we do not see the ones which open for us.— Alexander Graham Bell",
"The greatest lesson that I learned in all of this is that you have to start. Start now, start here, and start small. Keep it Simple.— Jack Dorsey",
"The crisis of today is the joke of tomorrow.—H.G. Wells",
"Either America will destroy ignorance or ignorance will destroy the United States.—W. E. B. Du Bois",
"It would be wonderful if I can inspire others, who are struggling to realize their dreams, to say: If this country kid could do it, let me keep slogging away.— Douglas Englebart",
"Everything you’ve ever wanted is on the other side of fear.— George Addair",
"Sometimes you can only find heaven by slowly backing away from hell.—Carrie Fisher",
"I’ve got to give props to the Jesuit priests.— Neil deGrasse Tyson",
"If God took the trouble to tell us eight hundred times to be glad and rejoice, He must want us to do it— Eleanor Hodgman Porter",
"That’s the best part of the whole thing, is the people that we’ve met along the way. We’ve met some wonderful, wonderful people and we wouldn’t have otherwise.— Pearl Dion",
"Conditions are never perfect. ‘Someday’ is a disease that will take your dreams to the grave with you…. If it’s important to you and you want to do it ‘eventually,’ just do it and correct course along the way.— Tim Ferriss",
"Whatever you do, don’t wake up at 65 years old and think about what you should have done with your life.— George Clooney",
"My soul is that of a drummer…. I didn’t do it to become rich and famous. I did it because it was the love of my life.— Ringo Starr",
"Just keep going. Everybody gets better if they keep at it.— Ted Williams",
"There can be no greater gift than that of giving one’s time and energy to help others without expecting anything in return.— Nelson Mandela",
"Good luck has its storm— George Lucas",
"Faith moves mountains, but you have to keep pushing while you’re praying.— Mason Cooley",
"No failure means no risk, which means nothing new—Richard Branson",
"I’m a big believer in the power of inexperience. It was the greatest asset I had when I started TFA. If I had known at the outset how hard it was going to be, I might never have started.—Wendy Kopp",
"Who sows virtue reaps honor.—Leonardo da Vinci",
"So often, people are working hard at the wrong thing. Working on the right thing is probably more important than working hard.—Caterina Fake",
"I think of doing a series as very hard work. But then I’ve talked to coal miners, and that’s really hard work.—William Shatner",
"Life is a daring adventure or it is nothing at all.— Helen Keller",
"Whenever you read a good book, somewhere in the world a door opens to allow in more light.— Vera Nazarian",
"To see we must forget the name of the thing we are looking at.—Claude Monet",
"I didn’t like the idea of being foolish, but I learned pretty soon that it was essential to fail and be foolish.—Daniel Day-Lewis",
"I hate that word: lucky. It cheapens a lot of hard work.—Peter Dinklage",
"Even when I was close to defeat I rose to my feet—Dr. Dre",
"Happiness is an inside job.— Anonymous",
"I was literally just doing my job.— Stanislav Petrov",
"All good ideas start out as bad ideas, that’s why it takes so long.— Steven Spielberg",
"The world has never had a good definition of the word liberty, and the American people, just now, are much in want of one.— Abraham Lincoln",
"I wanted a perfect ending. Now I’ve learned, the hard way, that some poems don’t rhyme, and some stories don’t have a clear beginning, middle and end.—Gilda Radner",
"Giving up smoking is the easiest thing in the world. I know because I’ve done it thousands of times.— Mark Twain",
"Only eyes washed by tears can see clearly.— Louis Mann",
"You have to learn the rules to be able to know how to break them.— Keira Knightley",
"The meaning of life is to find your gift. The purpose of life is to give it away.— Pablo Picasso",
"You are never too old to set another goal or to dream a new dream.— Les Brown",
"The essence of strategy is choosing what not to do.—Michael Porter",
"Let me tell you the secret that has led me to my goals: my strength lies solely in my tenacity.— Louis Pasteur",
"Your employees come first. And if you treat your employees right, guess what? Your customers come back.— Herb Kelleher",
"Success isn’t determined by how many times you win, but by how you play the week after you lose.— Pele",
"I am happy because I’m grateful. I choose to be grateful. That gratitude allows me to be happy.—Will Arnett",
"The true secret of happiness lies in taking a genuine interest in all the details of daily life.—William Morris",
"I would rather die of passion than of boredom.— Vincent Van Gogh",
"The impossible exists only until we find a way to make it possible—Mike Horn",
"Boredom is a lack of crazy. It’s a lack of creativity. Invention. Innovation. If you’re bored, blame yourself.—Katelyn S. Irons",
"The greatest danger in times of turbulence is not the turbulence; it is to act with yesterday’s logic.— Peter Drucker",
"Never let anyone define you. You are the only person who defines you. No one can speak for you. Only you speak for you. You are your only voice.— Terry Crews",
"Be so good they can’t ignore you.— Steve Martin",
"Nothing in all the world is more dangerous than sincere ignorance and conscientious stupidity.— Martin Luther King",
"The only way to win is to learn faster than anyone else.—Eric Ries",
"God doesn’t require us to succeed, he only requires that you try.— Mother Teresa",
"May I never be complete. May I never be content. May I never be perfect.—Chuck Palahniuk",
"Instead of wondering when your next vacation is, maybe you should set up a life you don’t need to escape from.— Seth Godin",
"The greatest test of courage on earth is to bear defeat without losing heart.— Robert Green Ingersoll",
"It isn’t hard to be good from time to time in sports. What is tough, is being good every day.— Willie Mays",
"Death is very likely the single best invention of life. It’s life’s change agent; it clears out the old to make way for the new. Right now, the new is you. But someday, not too long from now, you will gradually become the old and be cleared away. Sorry to be so dramatic, but it’s quite true. Your time is limited, so don’t waste it living someone else’s life.— Steve Jobs",
"Have no fear of perfection. You’ll never reach it.—Salvador Dali",
"The most common way people give up their power is by thinking they don’t have any.—Alice Walker",
"The person who agrees with you 80 percent of the time is an 80 percent friend, not a 20 percent enemy.— President Reagan",
"The thing about smart people is that they seem like crazy people to dumb people.—Stephen Hawking",
"People have confused playing devil’s advocate with being intelligent.— Cecily Strong",
"Winning is not everything, but wanting to win is.— Vince Lombardi",
"The minute you start caring about what other people think, is the minute you stop being yourself.—Meryl Streep",
"Optimism is the one quality more associated with success and happiness than any other.— Brian Tracy",
"People who say it cannot be done should not interrupt those who are doing it.— George Bernard Shaw",
"My only goal is to stay focused on my craft and make sure my life is as sharp as it can be to attack any character that is given to me.—Michael K. Williams",
"If you’re ever thinking, Oh, but I’m a waste of space and I’m a burden, remember: that also describes the Grand Canyon. Why don’t you have friends and family take pictures of you from a safe distance? Revel in your majestic profile?— Maria Bamford",
"If everybody loves you, something is wrong. Find at least one enemy to keep you alert.—Paulo Coelho",
"[T]he world is more malleable than you think and it’s waiting for you to hammer it into shape.—Bono",
"Yes, I am a dreamer. For a dreamer is one who can find his way by moonlight, and see the dawn before the rest of the world.— Oscar Wilde",
"Our heart knows what our mind has forgotten— it knows the sacred that is within all that exists, and through a depth of feeling we can once again experience this connection, this belonging.— Llewellyn Vaughan-Lee",
"Always make a total effort, even when the odds are against you.— Arnold Palmer",
"Life doesn’t run away from nobody. Life runs at people.— Joe Frazier",
"The last 10 percent it takes to launch something takes as much energy as the first 90 percent.— Rob Kalin",
"Don’t let life discourage you; everyone who got where he is had to begin where he was.— Richard L. Evans",
"Greatness is a lot of small things done well. Day after day, workout after workout, obedience after obedience, day after day.— Ray Lewis",
"Risk more than others think is safe. Dream more than others think is practical.—Howard Schultz",
"Next time you think you are important, try ordering somebody else’s dog around.—Will Rogers",
"I made a resolve then that I was going to amount to something if I could. And no hours, nor amount of labor, nor amount of money would deter me from giving the best that there was in me. And I have done that ever since, and I win by it. I know.— Harlan Sanders",
"If you see a bandwagon, it’s too late.—James Goldsmith",
"Everyone has a plan ’til they get punched in the mouth.— Mike Tyson",
"I’ve missed more than 9000 shots in my career. I’ve lost almost 300 games. 26 times, I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life. And that is why I succeed.— Michael Jordan",
"One, don’t believe everything that’s written about you. Two, don’t pick up too many checks.— George Babe Ruth",
"Before you speak, run this through your head: Is what I’m about to say true? Is it helpful? Is it inspiring? Is it necessary? Is it kind? If you cannot answer yes to these questions, then don’t say it, don’t tweet it, don’t write it.—Beret Guidera",
"You can and should set your own limits and clearly articulate them. This takes courage, but it is also liberating and empowering, and often earns you new respect.—Rosalind Brewer",
"Every vision is a joke until the first man accomplishes it; once realized, it becomes commonplace.— Robert Goddard",
"Don’t be afraid your life will end; be afraid that it will never begin.— Grace Hansen",
"When you meet somebody for the first time, you’re not meeting them. You’re meeting their representative.— Chris Rock",
"Not everything that can be counted counts, and not everything that counts can be counted.— William Bruce Cameron",
"We always honor our people when they die; we’ve got to honor them while we’re still alive.—Biz Markie",
"Live your life as an Exclamation rather than an Explanation— Isaac Newton",
"It’s easy to do nothing, but your heart breaks a little more every time you do.— Mark Ruffalo",
"Pressure is a privilege. It only comes to those who earn it.— Billie Jean King",
"There will come a time when you believe everything is finished. That will be the beginning.—Louis L’Amour",
"The truth is, everyone is going to hurt you. You just got to find the ones worth suffering for.— Bob Marley",
"Give me a stock clerk with a goal, and I will give you a man who will make history. Give me a man without a goal, and I will give you a stock clerk.— James Cash Penny",
"I shall never pay a dollar of your unjust penalty.— Susan B. Anthony",
"My first job was washing dishes in the basement of a nursing home for $2.10 an hour, and I learned as much about the value of hard work there as I ever did later.—Douglas Preston",
"Understand well as I may, my comprehension can only be an infinitesimal fraction of all I want to understand.— Ada Lovelace",
"When you are not willing to fully receive, you are training the universe not to give to you! It’s simple: if you aren’t willing to receive your share, it will go to someone else who is.—T. Harv Eker",
"You’re going to fall down, but the world doesn’t care how many times you fall down, as long as it’s one fewer than the numbers of times you get back up.— Aaron Sorkin",
"You do this because you like it, you think what you’re making is beautiful. And if you think it’s beautiful, maybe they think it’s beautiful.— Lou Reed",
"We are less bored than our ancestors were, but we are more afraid of boredom.—Bertrand Russell",
"Luck? I don’t know anything about luck. I’ve never banked on it, and I’m afraid of people who do. Luck to me is something else: hard work, and realizing what is opportunity and what isn’t.— Lucille Ball",
"Don’t aspire to make a living, aspire to make a difference.—Denzel Washington",
"It’s good to learn from your mistakes. It’s better to learn from other people’s mistakes.— Warren Buffett",
"Every man dies. Not every man really lives.—William Wallace",
"I feel like if it’s not scaring you, you’re doing it wrong.—Anna Kendrick",
"You don’t become what you want, you become what you believe.— Oprah Winfrey",
"There is no element of genius without some form of madness.— Leonardo DiCaprio",
"Sometimes you have to wander a bit, and do what you don’t want to in order to figure out what it is you’re supposed to do.— Larry David",
"Life always offers you a second chance. It is called tomorrow.— Dylan Thomas",
"To scale, do things that don’t scale.—Reid Hoffman",
"Normal is not something to aspire to, it’s something to get away from.— Jodie Foster",
"Sometimes your joy is the source of your smile, but sometimes your smile can be the source of your joy.—Thich Nhat Hanh",
"Men give me credit for some genius. All the genius I have lies in this; when I have a subject in hand, I study it profoundly. Day and night it is before me. My mind becomes pervaded with it. Then the effort that I have made is what people are pleased to call the fruit of genius. It is the fruit of labor and thought.— Alexander Hamilton",
"Time is life itself, and life resides in the human heart.— Michael Ende",
"The big money is not in the buying and selling … but in the waiting.— Charlie Munger",
"Gratitude is not only the greatest of virtues, but the parent of all the others.—Marcus Tullius Cicero",
"Someone once said, ‘Adversity introduces a man to himself.’ For some reason, that’s scary, but most people discover that adversity does make them stronger.—Max Cleland",
"I can’t tell you which one is right. But I can tell you which one is more fun.— Phil Knight",
"The lessons aren’t about wealth or fame or working harder and harder. The clearest message that we get from this 75-year study is this: Good relationships keep us happier and healthier. Period.—Dr. Robert Waldinger",
"I put instant coffee in a microwave oven and almost went back in time.— Steven Wright",
"The best way out is always through.— Robert Frost",
"If you want to lift yourself up, lift up someone else.— Booker T. Washington",
"Still and all, why bother? Here’s my answer. …—Kurt Vonnegut",
"In every good marriage, it helps sometimes to be a little deaf.—Ruth Bader Ginsburg",
"People think I’m an overnight success. No. It’s just that you all found me overnight.— Leslie Jones",
"To bring about change, you must not be afraid to take the first step. We will fail when we fail to try.—Rosa Parks",
"If you think you are too small to make a difference, try sleeping with a mosquito.—Dalai Lama",
"There is only one boss: the customer. And he can fire everybody in the company, from the chairman on down, simply by spending his money somewhere else.—Sam Walton",
"I always want to say to people who want to be rich and famous: ‘try being rich first’. See if that doesn’t cover most of it.—Bill Murray",
"We don’t want to suffer. We don’t want to feel discomfort. So the whole time, we’re living our lives in a very comfortable area. There’s no growth in that.— David Goggins",
"It’s better for people to miss you than to have seen too much of you.— Edward Norton",
"Forget about style; worry about results.—Bobby Orr",
"St. Francis of Assisi taught me that there is a wound in the Creation and that the greatest use we could make of our lives was to ask to be made a healer of it.— Alan Paton",
"My motto was always to keep swinging. Whether I was in a slump or feeling badly or having trouble off the field, the only thing to do was keep swinging.—Hank Aaron",
"Developing a good work ethic is key. Apply yourself at whatever you do, whether you’re a janitor or taking your first summer job, because that work ethic will be reflected in everything you do in life.—Tyler Perry",
"The road to success is not easy to navigate, but with hard work, drive, and passion, it’s possible to achieve the American dream.—Tommy Hilfiger",
"I don’t like to gamble, but if there’s one thing I’m willing to bet on, it’s myself.—Beyoncé",
"Nobody in life gets exactly what they thought they were going to get. But if you work really hard and you’re kind, amazing things will happen.—Conan O’Brien",
"Pray as though everything depended on God. Work as though everything depended on you.— Saint Augustine",
"If you don’t fall how are you going to know what getting up is like.— Stephen Curry",
"Frankly, it’s time for a new generation of leaders.—Senator Mitt Romney.",
"To be a Christian means to forgive the inexcusable because God has forgiven the inexcusable in you.— C. S. Lewis",
"I always prefer to believe the best of everybody, it saves so much trouble.—Rudyard Kipling",
"This is it. This is life, the one you get.—Jeff Barry"

]

const affirmations = [
"I am worthy of love and respect.",
"I choose to focus on what I can control.",
"Every challenge is an opportunity to grow.",
"I believe in my ability to achieve my goals.",
"I am grateful for the abundance in my life.",
"I am capable of creating the life I desire.",
"I trust in the process of life.",
"Each day is filled with new possibilities.",
"I am deserving of success and happiness.",
"My body is strong and capable.",
"I am open to learning and growing every day.",
"I am confident in my abilities.",
"I release what no longer serves me.",
"I am resilient and can handle anything that comes my way.",
"I am surrounded by love and support.",
"I choose to be positive and optimistic.",
"I am a magnet for success and good fortune.",
"I am grateful for my health and well-being.",
"I am becoming the best version of myself.",
"I am open to receiving abundance in all forms.",
"I am worthy of all the good things life has to offer.",
"I choose to focus on my strengths.",
"My mind is clear, focused, and energized.",
"I am grateful for today’s opportunities.",
"I radiate confidence and positivity.",
"I attract success and prosperity into my life.",
"I am in control of my thoughts and emotions.",
"Each day, I am more aligned with my purpose.",
"I am capable of achieving anything I set my mind to.",
"I choose happiness and joy in every moment.",
"I am proud of all my accomplishments.",
"I trust myself and my abilities.",
"I am grateful for the love and kindness in my life.",
"I am open to new experiences and opportunities.",
"I choose to let go of fear and embrace love.",
"I am creating a life I love, one step at a time.",
"My potential is limitless.",
"I am deserving of a happy, healthy relationship.",
"I am a source of inspiration to others.",
"My life is filled with love, joy, and abundance.",
"I embrace change and trust that everything is unfolding for my highest good.",
"I am confident in my ability to overcome challenges.",
"I am grateful for my family, friends, and support system.",
"I attract positive energy into my life.",
"I trust that everything is happening for my highest good.",
"I am deserving of success, love, and happiness.",
"I am the creator of my own destiny.",
"I believe in myself and my abilities.",
"I choose to focus on the good in my life.",
"I am a powerful creator of my own reality.",
"I attract love, abundance, and joy into my life.",
"I am grateful for the present moment and the opportunities it holds.",
"Every day, I am becoming more successful and fulfilled.",
"I am surrounded by positive and supportive people.",
"I embrace challenges as opportunities to grow.",
"I am a magnet for success, happiness, and fulfillment.",
"I trust in my ability to make the right decisions.",
"I am worthy of love, joy, and abundance.",
"I release the past and embrace the future with excitement.",
"My mind is filled with positive and uplifting thoughts.",
"I attract abundance into every aspect of my life.",
"I am grateful for all the blessings in my life.",
"I am worthy of all the good that life has to offer.",
"I trust that the universe is working in my favor.",
"I am proud of who I am and all that I have accomplished.",
"I am capable of achieving greatness.",
"I choose to be kind to myself and others.",
"I am in control of my own happiness.",
"I trust in my ability to create a fulfilling life.",
"I choose to focus on the positive in every situation.",
"I am grateful for my journey and the lessons it has taught me.",
"I am worthy of love, success, and abundance.",
"My life is filled with endless possibilities.",
"I choose to live a life filled with love and joy.",
"I attract positive experiences and opportunities into my life.",
"I trust that everything is unfolding perfectly for me.",
"I am deserving of all the good that life has to offer.",
"I am worthy of love, joy, and success.",
"I trust in my ability to overcome any obstacle.",
"I am grateful for my health, wealth, and happiness.",
"I am worthy of all the good things that are coming my way.",
"My mind is focused and clear.",
"I choose to be positive and optimistic about my future.",
"I am open to new opportunities and possibilities.",
"I am worthy of success and happiness.",
"Each day is filled with new opportunities to grow and learn.",
"I choose to be happy, healthy, and successful.",
"I trust that the universe is guiding me toward my highest good.",
"I am grateful for all the love and support in my life.",
"I am deserving of all the good things that life has to offer.",
"I choose to focus on what I can control and let go of the rest.",
"I am in control of my thoughts, feelings, and actions.",
"I trust in my ability to create the life I desire.",
"I am confident in my ability to achieve my goals.",
"I am worthy of success, love, and happiness."
]


// TYPES
type Task = {
  id: string
  title: string
  due_date: string | null
  status: string | null
  completed: boolean
  comp_date: string | null
}

// MAIN PAGE
export default function Home() {


 

const generateHabitLogs = async () => {
  const today = new Date()

  const { data: habits } = await supabase
    .from('habits')
    .select('*')

  if (!habits) return

  for (const habit of habits) {

    if (!habit.start_date) continue

    const startDate = new Date(habit.start_date)
    let current = new Date(startDate)

    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0]
      const weekday = current.getDay()

      let isDue = false

      if (habit.frequency_type === 'daily') isDue = true

      if (habit.frequency_type === 'weekly') {
        isDue = habit.weekday === weekday
      }

      if (habit.frequency_type === 'interval') {
        const diff = Math.floor(
          (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        isDue = diff >= 0 && diff % habit.interval_days === 0
      }

      if (!isDue) {
        current.setDate(current.getDate() + 1)
        continue
      }

      // check if already exists
      const { data: existing } = await supabase
        .from('habit_logs')
        .select('id')
        .eq('habit_id', habit.id)
        .eq('log_date', dateStr)

      if (!existing || existing.length === 0) {
        await supabase.from('habit_logs').insert([
          {
            habit_id: habit.id,
            log_date: dateStr
          }
        ])
      }

      current.setDate(current.getDate() + 1)
    }
  }
}
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Task App</h1>





       <div style={styles.cards}>


  <div style={{ ...oneThird, marginBottom: 20}}>
<AffirmationCard />
</div>

<div style={{ ...aThird, marginBottom: 20 }}>
<QuoteCard />
</div>

  <div style={{ ...twoThirds, marginBottom: 20 }}>
    <TasksCard />
  </div>
<div style={{ ...twoThirds, marginBottom: 20 }}>
  <NotesCard />
  </div>
  <div style={{ ...twoThirds, marginBottom: 20 }}>
  <IntentionsCard /></div>
  <div style={{ ...twoThirds, marginBottom: 20 }}>
  <DayRatingCard />
</div>
<div style={{ ...twoThirds, marginBottom: 20 }}>
   
    <CompletedTasksCard />
  </div>

<div style={{ ...twoThirds, marginBottom: 20 }}>
<HabitsCard />
</div>  
<div style={{ ...twoThirds, marginBottom: 20 }}>
  <NotesSearchCard />
</div>


</div>

      </div>
    </div>
  )
}
const isTaskDueToday = (task: any) => {
  const today = new Date()
  const todayStr = getTodayStr()

  // ✅ DAILY
  if (task.frequency_type === 'daily') return true

  // ✅ WEEKLY
  if (task.frequency_type === 'weekly') {
    return task.weekday === today.getDay()
  }

  // ✅ MONTHLY (FIXED)
  if (task.frequency_type === 'monthly') {
    if (!task.due_date) return false
    return today.getDate() === new Date(task.due_date).getDate()
  }

  // ✅ INTERVAL (FIXED)
  if (task.frequency_type === 'interval') {
    if (!task.due_date || !task.interval_days) return false

    const start = new Date(task.due_date)
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )

    return diff >= 0 && diff % task.interval_days === 0
  }

  return false
}
const isTaskDueOnDate = (task: any, date: Date) => {
  const day = date.getDay()

  if (task.frequency_type === 'daily') return true

  if (task.frequency_type === 'weekly') {
    return task.weekday === day
  }

  if (task.frequency_type === 'monthly') {
    return date.getDate() === new Date(task.due_date).getDate()
  }

  if (task.frequency_type === 'interval') {
    const start = new Date(task.due_date)
    const diff = Math.floor(
      (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diff >= 0 && diff % task.interval_days === 0
  }

  return false
}

const generateRecurringTasks = async () => {
  console.log('RUNNING TASK GENERATOR')
  const today = new Date()
  const todayStr = getTodayStr()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')

  if (!tasks) return

for (const task of tasks) {

  const today = getTodayStr()

  // ✅ ONLY templates
  if (task.parent_id) continue
  
  // ✅ ONLY recurring
  if (!task.frequency_type || task.frequency_type === 'once') continue

  // ✅ Check if due today
  let isDue = false

  if (task.frequency_type === 'daily') {
    
    isDue = true
  }

  if (task.frequency_type === 'weekly') {
    const todayDay = new Date().getDay()
    const taskDay = new Date(task.due_date).getDay()
    isDue = todayDay === taskDay
  }

  if (task.frequency_type === 'monthly') {
  const todayDate = new Date().getDate()
  const taskDate = new Date(task.due_date).getDate()

  isDue = todayDate === taskDate
}

if (task.frequency_type === 'interval') {
const toDateOnly = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

const todayDate = toDateOnly(new Date())
const start = toDateOnly(new Date(task.start_date))

const diff = Math.floor(
  (todayDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
)

  isDue = diff % task.interval_days === 0
}

  if (!isDue) continue
console.log('pass due check:', today)
  // ✅ Check if already exists for today
  const { data: existing } = await supabase
    .from('tasks')
    .select('id')
    .eq('parent_id', task.id)
    .eq('due_date', today)

  if (existing && existing.length > 0) continue

  // ✅ Create today's instance
  console.log('ABOUT TO CREATE:', task.title)
  await supabase.from('tasks').insert([
    {
      title: task.title,
      due_date: today,
      status: task.status,
      completed: false,
      parent_id: task.id,      // 🔑 link to template
      frequency_type: 'once'   // instance is NOT recurring
    }
    
  ])

  console.log('CREATED:', task.title)

  }
  
}
// TASKS CARD
function TasksCard() {
  const [frequencyType, setFrequencyType] = useState('once')
const [intervalDays, setIntervalDays] = useState(3)
const [weekday, setWeekday] = useState(1)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
 const [startDate, setStartDate] = useState(DEFAULT_START)
const [endDate, setEndDate] = useState(getTomorrowStr())
  // EDIT STATE
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editDueDate, setEditDueDate] = useState('')

  // FETCH TASKS
  const fetchTasks = async () => {
    let query = supabase
  .from('tasks')
  .select('*')
  .eq('completed', false)   // ✅ ONLY open tasks
  .order('due_date')

    if (startDate) query = query.gte('due_date', startDate)
    if (endDate) query = query.lte('due_date', endDate)

    const { data } = await query
    if (data) setTasks(data)
  }

  useEffect(() => {
  const run = async () => {
    const today = getTodayStr()

    const lastRun = localStorage.getItem('tasks_generated_date')

    if (lastRun === today) {
      // already ran today → just fetch
      fetchTasks()
      return
    }

    // run generator
    await generateRecurringTasks()

    // save that we ran today
    localStorage.setItem('tasks_generated_date', today)

    // refresh UI
    fetchTasks()
  }

  run()
}, [])

  // ADD
  const addTask = async () => {
    if (!title) return

   await supabase.from('tasks').insert([
  {
    title,
    due_date: dueDate || null,
    status,
    frequency_type: frequencyType,
    interval_days: frequencyType === 'interval' ? intervalDays : null,
    weekday: frequencyType === 'weekly' ? weekday : null,
  }
])

    setTitle('')
    setDueDate('')
    setStatus('')
    fetchTasks()
  }

 const isTaskDueToday = (task: any) => {
  const today = new Date()
  const day = today.getDay()

  // ONE-TIME
  if (task.frequency_type === 'once') {
    return !task.completed
  }

  // DAILY
  if (task.frequency_type === 'daily') {
    return task.comp_date !== getTodayStr()
  }

  // WEEKLY
  if (task.frequency_type === 'weekly') {
    return task.weekday === day && task.comp_date !== getTodayStr()
  }

  // INTERVAL
  if (task.frequency_type === 'interval') {
    const start = new Date(task.created_at)
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diff % task.interval_days === 0 && task.comp_date !== getTodayStr()
  }

  return false
}
  // COMPLETE
const toggleComplete = async (task: Task) => {
  const isCompleting = !task.completed

  await supabase
    .from('tasks')
    .update({
      completed: isCompleting,
      comp_date: isCompleting
        ? getTodayStr() // ✅ store date only
        : null,
    })
    .eq('id', task.id)

  fetchTasks()           // refresh open tasks
  window.location.reload()
  // we'll also refresh completed below
}
  // EDIT
  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditStatus(task.status || '')
    setEditDueDate(task.due_date || '')
  }

  const saveEdit = async (id: string) => {
    await supabase
      .from('tasks')
      .update({
        title: editTitle,
        status: editStatus,
        due_date: editDueDate || null,
      })
      .eq('id', id)

    setEditingId(null)
    fetchTasks()
  }

  return (
    <div style={card}>
      
        <div style={headerStyle('#16a34a')}>Tasks
       
          
          </div>
    
      {/* ADD */}
      <div style={{ padding: '12px 16px' }}>
      <div style={row}>
        <input
          style={input}
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={smallInput}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          style={smallInput}
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <select
  value={frequencyType}
  onChange={(e) => setFrequencyType(e.target.value)}
  style={smallInput}
>
  <option value="once">One-time</option>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
  <option value="interval">Every X days</option>
</select>
{frequencyType === 'interval' && (
  <input
    type="number"
    value={intervalDays}
    onChange={(e) => setIntervalDays(Number(e.target.value))}
    style={smallInput}
  />
)}

{frequencyType === 'weekly' && (
  <select
    value={weekday}
    onChange={(e) => setWeekday(Number(e.target.value))}
    style={smallInput}
  >
    <option value={0}>Sun</option>
    <option value={1}>Mon</option>
    <option value={2}>Tue</option>
    <option value={3}>Wed</option>
    <option value={4}>Thu</option>
    <option value={5}>Fri</option>
    <option value={6}>Sat</option>
  </select>
)}
        <button style={addBtn} onClick={addTask}>+</button>
      </div></div>



      {/* FILTER */}
       <div style={{ padding: '12px 16px' }}>
      <div style={row}>
        <input
          style={smallInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          style={smallInput}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button style={filterBtn} onClick={fetchTasks}>Filter</button>
      </div>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 10 }}>
        {tasks.map((task) => (
          <div key={task.id} style={taskRow}>
            <input
              type="checkbox"
               style={{ transform: 'scale(2)', cursor: 'pointer' }}
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />

            {editingId === task.id ? (
              <>
                <input
                  style={input}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  style={smallInput}
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
                <input
                  style={smallInput}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                />
                <button style={filterBtn} onClick={() => saveEdit(task.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
               <span style={{ flex: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
  <strong>#{task.id}</strong>
  <strong>{task.title}</strong>
</span>
                <span style={{ flex: 1 }}>{task.due_date || '-'}</span>
                <span style={{ flex: 1 }}>{task.status || '-'}</span>


                

                <button style={editBtn} onClick={() => startEdit(task)}>
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    
  )
}

// NOTES
function NotesCard() {
  const [notes, setNotes] = useState<any[]>([])
  const [tag, setTag] = useState('')
  const [noteDate, setNoteDate] = useState( getTodayStr()  )
  const [note, setNote] = useState('')

  const fetchNote = async (date: string) => {
  const { data } = await supabase
    .from('dailynotes')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: false })

  if (data) {
    setNotes(data)   // 👈 store ARRAY now
  } else {
    setNotes([])
  }
}

  useEffect(() => {
    fetchNote(noteDate)
  }, [noteDate])

const saveNote = async () => {
  if (!note) return

  const { data, error } = await supabase
    .from('dailynotes')
    .insert([
      {
        date: noteDate,
        note: note,
        tag: tag
      }
    ])

  console.log('SAVE:', { data, error })

  if (error) {
    alert(error.message)
  } else {
    setNote('')
    setTag('')
    fetchNote(noteDate)
  }
}

  return (
   <div style={card}>
  <div style={headerStyle('#9333ea')}>Notes</div>

  <div style={{ padding: 12 }}>
    {/* DATE AT TOP */}
    <div style={{ marginBottom: 10 }}>
      <input
        style={smallInput}
        type="date"
        value={noteDate}
        onChange={(e) => setNoteDate(e.target.value)}
      />
       <input
    style={smallInput}
    value={tag}
    onChange={(e) => setTag(e.target.value)}
    placeholder="tag"
  />
    </div>

    {/* FULL WIDTH TEXT AREA */}
    <textarea
      style={{
        width: '100%',
        height: 50,
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        resize: 'vertical',
      }}
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Write your notes..."
    />
    {notes.map((n) => (
  <div key={n.id} style={{ marginTop: 10 }}>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
  <div>{n.note}</div>

  {n.tag && (
    <div style={{ fontSize: 12, color: '#9333ea' }}>
      #{n.tag}
    </div>
  )}
</div>
  </div>
))}

    <button style={filterBtn} onClick={saveNote}>
      Save
    </button>
  </div>
</div>
  )
}

function IntentionsCard() {
  const [date, setDate] = useState(
    getTodayStr()
  )
  const [text, setText] = useState('')
  const [recent, setRecent] = useState<any[]>([])

  // load today's intention + last 5
  const fetchIntentions = async () => {
    // today
    const { data: today } = await supabase
      .from('intentions')
      .select('*')
     .eq('date', date)
      .maybeSingle()

    if (today) setText(today.intention)
    else setText('')

    // last 5 days
    const { data } = await supabase
      .from('intentions')
      .select('*')
      .order('date', { ascending: false })
      .limit(5)

    if (data) setRecent(data)
  }

  useEffect(() => {
    fetchIntentions()
  }, [date])

  const save = async () => {
  const { data, error } = await supabase
    .from('intentions')
    .upsert(
      {
        date,
        intention: text,
      },
      { onConflict: 'date' }
    )

  console.log('SAVE RESULT:', { data, error })

  if (error) {
    alert(error.message)
  }

  fetchIntentions()
}




  
  return (
    <div style={card}>
  <div style={headerStyle('#f97316')}>Intention</div>

  <div style={{ padding: 12 }}>
    {/* DATE AT TOP */}
    <div style={{ marginBottom: 10 }}>
      <input
        style={smallInput}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    {/* LABEL */}
    <div style={{ marginBottom: 6, fontWeight: 500 }}>
      Today I will...
    </div>

    {/* FULL WIDTH TEXT */}
    <textarea
      style={{
        width: '100%',
        height: 120,
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        resize: 'vertical',
      }}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Today I will."
    />

    <button style={filterBtn} onClick={save}>
      Save
    </button>

    {/* LAST 5 DAYS */}
    <div style={{ marginTop: 20 }}>
      <h4>Last 5 Days</h4>

      {recent.map((item) => (
        <div key={item.id} style={taskRow}>
          <div style={{ width: 100 }}>
            {item.date}
          </div>
          <div>{item.intention}</div>
        </div>
      ))}
    </div>
  </div>
</div>
  )
}

function DayRatingCard() {
  
  const [recent, setRecent] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [date, setDate] = useState(
    getTodayStr()
  )
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const getColor = (r: number) => {
  if (r <= 3) return '#ef4444'   // red
  if (r <= 6) return '#f59e0b'   // orange
  if (r <= 8) return '#3b82f6'   // blue
  return '#22c55e'               // green
}

  const emojis = ['😞', '😐', '🙂', '😊', '😄']

  const fetchRating = async () => {
  // current day
  const { data } = await supabase
    .from('day_ratings')
    .select('*')
    .eq('rating_date', date)
    .maybeSingle()

  if (data) {
    setText(data.what_went_well || '')
    setRating(data.rating ?? 0)
  } else {
    setText('')
    setRating(0)
  }

  // last 5 days
  const { data: recentData } = await supabase
    .from('day_ratings')
    .select('*')
    .order('rating_date', { ascending: false })
    .limit(5)

  if (recentData) setRecent(recentData)

    const { data: chart } = await supabase
  .from('day_ratings')
  .select('*')
  .order('rating_date', { ascending: true })
  .limit(10)

if (chart) setChartData(chart)
}
  useEffect(() => {
    fetchRating()
  }, [date])

  const save = async () => {
    await supabase.from('day_ratings').upsert(
      {
        rating_date: date,
        what_went_well: text,
        rating,
      },
      { onConflict: 'rating_date' }
    )
  }

  return (
  <div style={card}>
  <div style={headerStyle('#3b82f6')}>Rate the Day</div>

  <div style={{ padding: 12 }}>
    {/* DATE AT TOP */}
    <div style={{ marginBottom: 10 }}>
      <input
        style={smallInput}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    {/* TEXT */}
    <div style={{ marginBottom: 6, fontWeight: 500 }}>
      What went well
    </div>

    <textarea
      style={{
        width: '100%',
        height: 120,
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        resize: 'vertical',
      }}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="What went well..."
    />

    {/* RATING */}
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
  {[...Array(11)].map((_, i) => (
    <button
      key={i}
      onClick={() => setRating(i)}
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        border: rating === i ? '2px solid #3b82f6' : '1px solid #ccc',
        background: 'white',
        cursor: 'pointer',
        fontWeight: 600,
         color: getColor(i) 
      }}
    >
      {i}
    </button>
  ))}
</div>

    <button style={filterBtn} onClick={save}>
      Save
    </button>
    <div style={{ marginTop: 20 }}>
  <h4>Last 5 Days</h4>

  {recent.map((item) => (
    <div key={item.id} style={taskRow}>
      <div style={{ width: 100 }}>
        {item.rating_date}
      </div>

      <div style={{ width: 50 }}>
        {item.rating}
      </div>

      <div>{item.what_went_well}</div>
    </div>
  ))}
</div>
  </div>
</div>  )
}


function CompletedTasksCard() {
 const today = new Date()

const twoDaysAgo = new Date()
twoDaysAgo.setDate(today.getDate() - 2)

const format = (d: Date) => {
  return `${d.getFullYear()}-${
    String(d.getMonth() + 1).padStart(2, '0')
  }-${String(d.getDate()).padStart(2, '0')}`
}



  const [startDate, setStartDate] = useState(format(today))
  const [endDate, setEndDate] = useState(format(today))
  const [tasks, setTasks] = useState<any[]>([])

  const fetchCompleted = async () => {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('completed', true)
      .order('comp_date', { ascending: false })

    if (startDate) query = query.gte('comp_date', startDate)
    if (endDate) query = query.lte('comp_date', endDate)

    const { data } = await query
    if (data) setTasks(data)
  }

  useEffect(() => {
  fetchCompleted()
}, [startDate, endDate])

  return (
    <div style={card}>
      <div style={headerStyle('#0ea5e9')}><h2>Completed Tasks</h2>
       
          </div>
      

      {/* Filter */}
      <div style={row }>
        <div style={{ padding: '12px 16px' }}>
        <input
          style={smallInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          style={smallInput}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button style={filterBtn} onClick={fetchCompleted}>
          Filter
        </button>
      </div>
      </div>
      

      {/* List */}
      <div style={{ padding: '12px 16px' }}>
        
      <div style={{ marginTop: 10 }}>
        {tasks.length === 0 && <div>No completed tasks</div>}

        {tasks.map((task) => (
          <div key={task.id} style={taskRow}>
            <span style={{ flex: 2 }}>
              <strong>{task.title}</strong>
            </span>

            <span style={{ flex: 1 }}>
              {task.comp_date || '-'}
            </span>

            <span style={{ flex: 1 }}>
              {task.status || '-'}
            </span>
          </div>
        ))}
      </div></div>
      
    </div>
  )
}

function QuoteCard() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
  const updateQuote = () => {
    const today = new Date()

    const dayNumber = Math.floor(
      today.getTime() / (1000 * 60 * 60 * 24)
    )

    const index = dayNumber % quotes.length
    setQuote(quotes[index])
  }

  updateQuote()

  const now = new Date()
  const msUntilMidnight =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    ).getTime() - now.getTime()

  const timeout = setTimeout(updateQuote, msUntilMidnight)

  return () => clearTimeout(timeout)
}, [])
  return (
    <div style={card}>
      <div style={headerStyle('#6366f1')}>
        Quote of the Day
      </div>

      <div style={{
        height:200,
  padding: 16,
  fontStyle: 'italic',
  fontSize: 15,
  lineHeight: 1.5,
  textAlign: 'center'
}}>
        {quote}
      </div>
    </div>
  )
}


// STYLES
const styles = {  page: {
    background: '#e5e7eb',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 40,
  },

container: {
  background: '#f3f4f6',
  padding: 20,
  width: '100%',
  maxWidth: 1100,      // ~2/3 feel but responsive
  margin: '0 auto',
},
  title: {
    textAlign: 'center' as const,
    marginBottom: 20,
  },
cards: {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)', // ✅ force 3 columns
  gap: 20,
},
}

function HabitsCard() {
  
  useEffect(() => {
  generateHabitLogs()
  fetchHabits()
}, [])
  const todayStr = getTodayStr()
  const displayDate = new Date(todayStr).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
})
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(getTodayStr())
  const weekday = today.getDay()

  const [habits, setHabits] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [newHabit, setNewHabit] = useState('')

  const [frequencyType, setFrequencyType] = useState('daily')
  const [intervalDays, setIntervalDays] = useState(3)
  const [habitWeekday, setHabitWeekday] = useState(6)

  const [showCelebration, setShowCelebration] = useState(true)

  // FETCH
  const fetchHabits = async () => {
    const { data } = await supabase.from('habits').select('*')
    if (data) setHabits(data)

    const { data: logData } = await supabase
      .from('habit_logs')
      .select('*')
     .eq('log_date', getTodayStr())

    if (logData) setLogs(logData)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

useEffect(() => {
  const now = new Date()

  const msUntilMidnight =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    ).getTime() - now.getTime()

  const timeout = setTimeout(() => {
    setCurrentDate(getTodayStr())
  }, msUntilMidnight)

  return () => clearTimeout(timeout)
}, [])


  // LOGIC
  const isDueToday = (habit: any) => {
    if (habit.frequency_type === 'daily') return true

    if (habit.frequency_type === 'weekly') {
      return habit.weekday === weekday
    }

    if (habit.frequency_type === 'interval') {
      const start = new Date(habit.start_date)
      const diff = Math.floor(
        (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
      return diff % habit.interval_days === 0
    }

    return false
  }

const isCompleted = (habitId: string) => {
  return logs.find(
    (l) =>
      l.habit_id === habitId &&
      l.log_date === getTodayStr()
  )?.completed ?? false
}

  const dueHabits = habits.filter(isDueToday)

  const allCompleted =
    dueHabits.length > 0 &&
    dueHabits.every((h) => isCompleted(h.id))

  const alreadyShownToday =
  typeof window !== 'undefined' &&
  localStorage.getItem('celebration_' + currentDate) === 'true'
  
const shouldCelebrate =
  allCompleted && showCelebration && !alreadyShownToday

  // RESET celebration when habits change
 useEffect(() => {
  if (allCompleted && !alreadyShownToday) {
    localStorage.setItem('celebration_' + currentDate, 'true')
  }
}, [allCompleted])

  // ACTIONS
 const toggleHabit = async (habitId: string) => {
  const today = getTodayStr()

  // 🔍 get the correct log directly from DB
  const { data: log, error: fetchError } = await supabase
  .from('habit_logs')
  .select('*')
  .eq('habit_id', habitId)
  .eq('log_date', today)
  .maybeSingle()

  console.log('FOUND LOG:', log, fetchError)

  if (!log) {
  console.log('Creating missing log...')

  const { data: newLog } = await supabase
    .from('habit_logs')
    .insert([
      {
        habit_id: habitId,
        log_date: today,
        completed: true // since user just checked it
      }
    ])
    .select()
    .single()

  fetchHabits()
  return
}
  // 🔄 update completion
  const { error: updateError } = await supabase
    .from('habit_logs')
    .update({ completed: !log.completed })
    .eq('id', log.id)

  console.log('UPDATE ERROR:', updateError)

  fetchHabits()
}


  const getFrequencyLabel = (habit: any) => {
  if (habit.frequency_type === 'daily') return 'Daily'

  if (habit.frequency_type === 'interval') {
    return `Every ${habit.interval_days} days`
  }

  if (habit.frequency_type === 'weekly') {
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][habit.weekday]
  }

  return ''
}

  const deleteHabit = async (id: string) => {
  // delete logs first
  await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', id)

  // then delete habit
  await supabase
    .from('habits')
    .delete()
    .eq('id', id)

  fetchHabits()
}
  const addHabit = async () => {
    if (!newHabit) return

    await supabase.from('habits').insert([
      {
        name: newHabit,
        frequency_type: frequencyType,
        interval_days:
          frequencyType === 'interval' ? intervalDays : null,
        weekday:
          frequencyType === 'weekly' ? habitWeekday : null,
        start_date: currentDate,
      },
    ])

    setNewHabit('')
    fetchHabits()
  }
  const sortedHabits = [...dueHabits].sort((a, b) => {
  const aDone = isCompleted(a.id)
  const bDone = isCompleted(b.id)

  return Number(aDone) - Number(bDone)
})
  return (
    <div style={card}>
      <div style={headerStyle('#22c55e')}>
        Habits — {displayDate}
      </div>

      <div style={{ padding: 12 }}>
        
        {/* 🎆 CELEBRATION */}
        {shouldCelebrate && (
          <div style={{ textAlign: 'center', marginBottom: 20,  }}>
            <img
              src="/fireworks.gif"
              alt="celebration"
             style={{
 
    maxHeight: 200,
    objectFit: 'contain',
    borderRadius: 12
  }}
            />

            <div style={{ marginTop: 10, fontWeight: 600 }}>
              All habits complete! 🔥
            </div>

            <button
              style={filterBtn}
              onClick={() => setShowCelebration(false)}
            >
              Done celebrating 🙂
            </button>
          </div>
        )}

        {/* ➕ ADD HABIT */}
        <div style={{ marginTop: 10 }}>
          <input
            style={input}
            placeholder="New habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />

         <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
  <select
    value={frequencyType}
    onChange={(e) => setFrequencyType(e.target.value)}
    style={smallInput}
  >
    <option value="daily">Daily</option>
    <option value="interval">Every X Days</option>
    <option value="weekly">Specific Day</option>
  </select>

  <button style={addBtn} onClick={addHabit}>
    +
  </button>
</div>

          {frequencyType === 'interval' && (
            <div style={{ marginTop: 8 }}>
              <input
                type="number"
                min="1"
                value={intervalDays}
                onChange={(e) =>
                  setIntervalDays(Number(e.target.value))
                }
                style={smallInput}
              />
              <span style={{ marginLeft: 6 }}>days</span>
            </div>
          )}

          {frequencyType === 'weekly' && (
            <div style={{ marginTop: 8 }}>
              <select
                value={habitWeekday}
                onChange={(e) =>
                  setHabitWeekday(Number(e.target.value))
                }
                style={smallInput}
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          )}

         
        </div>

        {/* 📋 HABIT LIST */}
     <div
  style={{
    maxHeight: 220,   // ~5 rows (adjust if needed)
    overflowY: 'auto',
    marginTop: 8
  }}
>
  {sortedHabits.map((habit) => (
    <div key={habit.id} style={taskRow}>
              <input
                type="checkbox"
                 style={{ transform: 'scale(2)', cursor: 'pointer' }}
                checked={!!isCompleted(habit.id)}
                onChange={() => toggleHabit(habit.id)}
              />

                      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          textDecoration: isCompleted(habit.id)
                            ? 'line-through'
                            : 'none',
                          opacity: isCompleted(habit.id) ? 0.6 : 1
                        }}
                      >
                        {habit.name}
                      </span>

                      <span
                        style={{
                          fontSize: 12,
                          color: '#6b7280',
                          marginLeft: 8
                        }}
                      >
                        ({getFrequencyLabel(habit)})
                      </span>
                    </div>
              <button
                style={deleteBtn}
                onClick={() => deleteHabit(habit.id)}
              >
                ×

              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
function Celebration() {
  return (
    <div
      style={{
        textAlign: 'center',
        
        padding: 20,
        position: 'relative',
      }}
    >
      {/* Firework Image */}
      <img
        src="/fireworks.gif"
        alt="celebration"
        style={{
          
          borderRadius: 15,
          width: 200,
          height: 200,
          objectFit: 'contain',
          animation: 'pop 0.6s ease-out',
        }}
      />

      {/* Text */}
      <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600 }}>
        All habits complete! 🔥
      </div>

      <div style={{ fontSize: 14, color: '#6b7280' }}>
        Strong finish today
      </div>
    </div>
  )
}

function AffirmationCard() {
  
  const [affirmation, setAffirmation] = useState('')

useEffect(() => {
  const today = new Date()

  const dayNumber = Math.floor(
    today.getTime() / (1000 * 60 * 60 * 24)
  )

  const index = dayNumber % affirmations.length

  setAffirmation(affirmations[index])
}, [])

  return (
    <div style={card}>
      <div style={headerStyle('#ec4899')}>Affirmation</div>

      <div style={{
     height:200,
       padding: 16,
  fontStyle: 'italic',
  fontSize: 15,
  lineHeight: 1.5,
  textAlign: 'center'
}}>
        {affirmation}
      </div>
    </div>
  )
}

function NotesSearchCard() {
  const [date, setDate] = useState('')
  const [tag, setTag] = useState('')
  const [keyword, setKeyword] = useState('')
  const [taskId, setTaskId] = useState('')
  const [results, setResults] = useState<any[]>([])

 const search = async () => {
  let query = supabase
    .from('dailynotes')
    .select('*')
    .order('date', { ascending: false })   // ✅ FIXED

  const cleanKeyword = keyword.trim()
  const cleanTag = tag.trim()
  const cleanDate = date.trim()

  if (cleanDate) {
    query = query.eq('date', cleanDate)   // ✅ FIXED
  }

  if (cleanTag) {
    query = query.ilike('tag', `%${cleanTag}%`)
  }

  if (cleanKeyword) {
    query = query.ilike('note', `%${cleanKeyword}%`)
  }

  const { data, error } = await query

  console.log('RESULTS:', data, error)

  setResults(data || [])
}
  return (
    <div style={card}>
      <div style={headerStyle('#6366f1')}>Search Notes</div>

      <div style={{ padding: 12 }}>
        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          
          <input
            style={smallInput}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            style={smallInput}
            placeholder="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <input
            style={input}
            placeholder="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            style={smallInput}
            placeholder="task #"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
          />

          <button style={filterBtn} onClick={search}>
            Search
          </button>
        </div>

        {/* RESULTS */}
        <div style={{ marginTop: 15 }}>
          {results.length === 0 && <div>No results</div>}

          {results.map((n) => (
            <div key={n.id} style={taskRow}>
              
              <div style={{ width: 90 }}>
                {n.note_date}
              </div>

              <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                <div>{n.note}</div>

                {n.tag && (
                  <span
                    style={{
                      background: '#f3e8ff',
                      color: '#9333ea',
                      padding: '2px 6px',
                      borderRadius: 12,
                      fontSize: 10
                    }}
                  >
                    #{n.tag}
                  </span>
                )}

                {n.task_id && (
                  <span style={{ fontSize: 11, color: '#555' }}>
                    task:{n.task_id}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const twoThirds = {
  gridColumn: 'span 3', // ✅ takes 2 out of 3 columns
}
const aThird = {
  gridColumn: 'span 2', // ✅ takes 2 out of 3 columns
}
const oneThird = {
  gridColumn: 'span 1', // ✅ takes 2 out of 3 columns
}

 const card = {
  border: '1px solid #ddd',
  borderRadius: 12,
  background: '#fff',
  overflow: 'hidden',
 boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
}

const row = {
  display: 'flex',
  gap: 8,
  marginTop: 10,
}

const input = {
  flex: 1,
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
}
const deleteBtn = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '4px 8px',
  borderRadius: 6,
  cursor: 'pointer',
}

const smallInput = {
  width: 120,
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
}

const addBtn = {
  background: '#22c55e',
  color: 'white',
  border: 'none',
  padding: '0 12px',
  borderRadius: 6,
}

const filterBtn = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 6,
  marginTop: 10,
}

const editBtn = {
  background: '#f59e0b',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: 6,
}

const taskRow = {
  display: 'flex',
  gap: 10,
  padding: 8,
  border: '1px solid #eee',
  borderRadius: 6,
  marginTop: 6,
}