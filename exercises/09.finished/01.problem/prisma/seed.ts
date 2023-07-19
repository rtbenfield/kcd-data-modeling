import fs from 'fs'
import { faker } from '@faker-js/faker'
import { createUser } from 'tests/db-utils.ts'
import { prisma } from '~/utils/db.server.ts'

const altTexts = [
	'a nice country house',
	'a city scape',
	'a sunrise',
	'a group of friends',
	'friends being inclusive of someone who looks lonely',
	'an illustration of a hot air balloon',
	'an office full of laptops and other office equipment that look like it was abandond in a rush out of the building in an emergency years ago.',
	'a rusty lock',
	'something very happy in nature',
	`someone at the end of a cry session who's starting to feel a little better.`,
]

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	await prisma.image.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	const totalUsers = 20
	console.time(`👤 Created ${totalUsers} users...`)
	await Promise.all(
		Array.from({ length: totalUsers }, async (_, index) => {
			const userData = createUser()
			const userCreatedUpdated = getCreatedAndUpdated()
			const user = await prisma.user.create({
				select: { id: true },
				data: {
					...userData,
					...userCreatedUpdated,
					image: {
						create: await img({
							filepath: `./tests/fixtures/images/user/${index % 10}.jpg`,
						}),
					},
					notes: {
						create: await Promise.all(
							Array.from({
								length: faker.number.int({ min: 0, max: 3 }),
							}).map(async () => ({
								title: faker.lorem.sentence(),
								content: faker.lorem.paragraphs(),
								...getCreatedAndUpdated(userCreatedUpdated.createdAt),
								images: {
									create: await Promise.all(
										Array.from({
											length: faker.number.int({ min: 0, max: 5 }),
										}).map(async () => {
											const imgNumber = faker.number.int({ min: 0, max: 9 })
											return img({
												altText: altTexts[imgNumber],
												filepath: `./tests/fixtures/images/notes/${imgNumber}.png`,
											})
										}),
									),
								},
							})),
						),
					},
				},
			})
			return user
		}),
	).then(users => users.filter(Boolean))
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(`🐨 Created user "kody"`)
	await prisma.user.create({
		data: {
			email: 'kody@kcd.dev',
			username: 'kody',
			name: 'Kody',
			image: {
				create: await img({
					filepath: './tests/fixtures/images/user/kody.png',
				}),
			},
			notes: {
				create: [
					{
						id: 'd27a197e',
						title: 'Basic Koala Facts',
						content:
							'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
						images: {
							create: [
								await img({
									altText: 'an adorable koala cartoon illustration',
									filepath: './tests/fixtures/images/kody-notes/cute-koala.png',
								}),
								await img({
									altText: 'a cartoon illustration of a koala in a tree eating',
									filepath:
										'./tests/fixtures/images/kody-notes/koala-eating.png',
								}),
							],
						},
					},
					{
						id: '414f0c09',
						title: 'Koalas like to cuddle',
						content:
							'Cuddly critters, koalas measure about 60cm to 85cm long, and weigh about 14kg.',
						images: {
							create: [
								await img({
									altText: 'a cartoon illustration of koalas cuddling',
									filepath:
										'./tests/fixtures/images/kody-notes/koala-cuddle.png',
								}),
							],
						},
					},
					{
						id: '260366b1',
						title: 'Not bears',
						content:
							"Although you may have heard people call them koala 'bears', these awesome animals aren’t bears at all – they are in fact marsupials. A group of mammals, most marsupials have pouches where their newborns develop.",
					},
					{
						id: 'bb79cf45',
						title: 'Snowboarding Adventure',
						content:
							"Today was an epic day on the slopes! Shredded fresh powder with my friends, caught some sick air, and even attempted a backflip. Can't wait for the next snowy adventure!",
						images: {
							create: [
								await img({
									altText: 'a beautiful mountain covered in snow',
									filepath: './tests/fixtures/images/kody-notes/mountain.png',
								}),
							],
						},
					},
					{
						id: '9f4308be',
						title: 'Onewheel Tricks',
						content:
							"Mastered a new trick on my Onewheel today called '180 Spin'. It's exhilarating to carve through the streets while pulling off these rad moves. Time to level up and learn more!",
					},
					{
						id: '306021fb',
						title: 'Coding Dilemma',
						content:
							"Stuck on a bug in my latest coding project. Need to figure out why my function isn't returning the expected output. Time to dig deep, debug, and conquer this challenge!",
						images: {
							create: [
								await img({
									altText: 'a koala coding at the computer',
									filepath:
										'./tests/fixtures/images/kody-notes/koala-coder.png',
								}),
							],
						},
					},
					{
						id: '16d4912a',
						title: 'Coding Mentorship',
						content:
							"Had a fantastic coding mentoring session today with Sarah. Helped her understand the concept of recursion, and she made great progress. It's incredibly fulfilling to help others improve their coding skills.",
						images: {
							create: [
								await img({
									altText:
										'a koala in a friendly and helpful posture. The Koala is standing next to and teaching a woman who is coding on a computer and shows positive signs of learning and understanding what is being explained.',
									filepath:
										'./tests/fixtures/images/kody-notes/koala-mentor.png',
								}),
							],
						},
					},
					{
						id: '3199199e',
						title: 'Koala Fun Facts',
						content:
							"Did you know that koalas sleep for up to 20 hours a day? It's because their diet of eucalyptus leaves doesn't provide much energy. But when I'm awake, I enjoy munching on leaves, chilling in trees, and being the cuddliest koala around!",
					},
					{
						id: '2030ffd3',
						title: 'Skiing Adventure',
						content:
							'Spent the day hitting the slopes on my skis. The fresh powder made for some incredible runs and breathtaking views. Skiing down the mountain at top speed is an adrenaline rush like no other!',
						images: {
							create: [
								await img({
									altText: 'a beautiful mountain covered in snow',
									filepath: './tests/fixtures/images/kody-notes/mountain.png',
								}),
							],
						},
					},
					{
						id: 'f375a804',
						title: 'Code Jam Success',
						content:
							'Participated in a coding competition today and secured the first place! The adrenaline, the challenging problems, and the satisfaction of finding optimal solutions—it was an amazing experience. Feeling proud and motivated to keep pushing my coding skills further!',
						images: {
							create: [
								await img({
									altText: 'a koala coding at the computer',
									filepath:
										'./tests/fixtures/images/kody-notes/koala-coder.png',
								}),
							],
						},
					},
					{
						id: '562c541b',
						title: 'Koala Conservation Efforts',
						content:
							"Joined a local conservation group to protect koalas and their habitats. Together, we're planting more eucalyptus trees, raising awareness about their endangered status, and working towards a sustainable future for these adorable creatures. Every small step counts!",
					},
					// extra long note to test scrolling
					{
						id: 'f67ca40b',
						title: 'Game day',
						content:
							"Just got back from the most amazing game. I've been playing soccer for a long time, but I've not once scored a goal. Well, today all that changed! I finally scored my first ever goal.\n\nI'm in an indoor league, and my team's not the best, but we're pretty good and I have fun, that's all that really matters. Anyway, I found myself at the other end of the field with the ball. It was just me and the goalie. I normally just kick the ball and hope it goes in, but the ball was already rolling toward the goal. The goalie was about to get the ball, so I had to charge. I managed to get possession of the ball just before the goalie got it. I brought it around the goalie and had a perfect shot. I screamed so loud in excitement. After all these years playing, I finally scored a goal!\n\nI know it's not a lot for most folks, but it meant a lot to me. We did end up winning the game by one. It makes me feel great that I had a part to play in that.\n\nIn this team, I'm the captain. I'm constantly cheering my team on. Even after getting injured, I continued to come and watch from the side-lines. I enjoy yelling (encouragingly) at my team mates and helping them be the best they can. I'm definitely not the best player by a long stretch. But I really enjoy the game. It's a great way to get exercise and have good social interactions once a week.\n\nThat said, it can be hard to keep people coming and paying dues and stuff. If people don't show up it can be really hard to find subs. I have a list of people I can text, but sometimes I can't find anyone.\n\nBut yeah, today was awesome. I felt like more than just a player that gets in the way of the opposition, but an actual asset to the team. Really great feeling.\n\nAnyway, I'm rambling at this point and really this is just so we can have a note that's pretty long to test things out. I think it's long enough now... Cheers!",
						images: {
							create: [
								await img({
									altText:
										'a cute cartoon koala kicking a soccer ball on a soccer field ',
									filepath:
										'./tests/fixtures/images/kody-notes/koala-soccer.png',
								}),
							],
						},
					},
				],
			},
		},
	})
	console.timeEnd(`🐨 Created user "kody"`)

	console.timeEnd(`🌱 Database has been seeded`)
}

async function img({
	altText,
	filepath,
}: {
	altText?: string
	filepath: string
}) {
	const contentType = filepath.endsWith('.png') ? 'image/png' : 'image/jpeg'
	return {
		contentType,
		altText,
		file: {
			create: {
				blob: await fs.promises.readFile(filepath),
			},
		},
	}
}

function getCreatedAndUpdated(from: Date = new Date(2020, 0, 1)) {
	const createdAt = faker.date.between({ from, to: new Date() })
	const updatedAt = faker.date.between({ from: createdAt, to: new Date() })
	return { createdAt, updatedAt }
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})