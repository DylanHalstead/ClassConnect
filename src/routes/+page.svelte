<script lang="ts">
	import Sparkles from "$lib/components/landing/Sparkles.svelte";
	import BackgroundBeams from "$lib/components/landing/BackgroundBeams.svelte";
	import Tabs from "$lib/components/landing/Tabs.svelte";
	import grid from "$lib/assets/grid.svg";
	import linear from "$lib/assets/linear.webp";
	import {
		Icon,
		AcademicCap,
		CalendarDays,
		Flag,
		VideoCamera,
		PaperAirplane
	} from "svelte-hero-icons";

	const teamMembers = [
		{
			id: 1,
			name: "Dylan Halstead",
			designation: ["Fullstack Engineer", "Product Manager"],
			image:
				"https://media.licdn.com/dms/image/D4E03AQHQsFPnC337xw/profile-displayphoto-shrink_200_200/0/1686357059431?e=1714608000&v=beta&t=sv2_qWw-JbS4sY8GAkKncgQWj1dSLYUrLmcelps1zBM",
			link: "https://dylanhalstead.com/"
		},
		{
			id: 2,
			name: "Jaden Peterson",
			designation: ["Fullstack Engineer"],
			image:
				"https://media.licdn.com/dms/image/C4E03AQFZytuUfaHpuA/profile-displayphoto-shrink_200_200/0/1644355335246?e=1714608000&v=beta&t=EXk96mYGKIYASMXjlOnLmlJ0IWxth1zmZs3OWn9Rg8o",
			link: "https://www.linkedin.com/in/petersonjaden/"
		},
		{
			id: 3,
			name: "James Anderson",
			designation: ["Frontend Engineer", "UX Designer"],
			image:
				"https://media.licdn.com/dms/image/D4E03AQGxEvJ9OQYZJg/profile-displayphoto-shrink_200_200/0/1665677008605?e=1714608000&v=beta&t=8v49KkcMJGN99BgnMgBu4Kwk1zmPsrg6_MjqFsqoI7E",
			link: "https://www.linkedin.com/in/janderson2429/"
		},
		{
			id: 4,
			name: "Kaitlyn Finberg",
			designation: ["Frontend Engineer", "UX Designer"],
			image:
				"https://media.licdn.com/dms/image/D4E03AQGoXjmqJG-FdA/profile-displayphoto-shrink_200_200/0/1671495522143?e=1714608000&v=beta&t=kKz2h0yE-uC0iU4RBb1FC4ar5W68aJcM-5hd65sSCME",
			link: "https://www.linkedin.com/in/kaitlyn-finberg/"
		},
		{
			id: 5,
			name: "Lijuan Cao",
			designation: ["Faculty Advisor", "Project Manager"],
			image: "https://cci.charlotte.edu/wp-content/uploads/sites/209/2023/04/Cao-LO-300x450.jpg",
			link: "https://cci.charlotte.edu/directory/lijuan-cao/"
		}
	];

	const cards = [
		{
			title: "Interactive Calendar",
			content:
				"Stay organized with our interactive calendar, displaying all your courses office hours.",
			icon: CalendarDays
		},
		{
			title: "Zoom Integration",
			content:
				"Connect with instructors and classmates from anywhere with automatic zoom links and personal calendar invites.",
			icon: VideoCamera
		},
		{
			title: "Reputation System",
			content:
				"Promote accountability and fairness in scheduling utilizing our flexible tooling to fine tune your courses.",
			icon: Flag
		},
		{
			title: "By Students, for Students",
			content:
				"We built an app WE would want to use. As a student or as an instructional team member.",
			icon: AcademicCap
		}
	];

	const tabs = [
		{
			title: "Calendar",
			value: "calendar",
			content: `<div className="w-full overflow-relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-accent to-info"> <p class="text-white">Calendar Tab</p> <img src="${linear}" alt="dummy image" width="1000" height="1000" class="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto" /> </div>`
		},
		{
			title: "Limit Office Hours",
			value: "limit-office-hours",
			content: `<div className="w-full overflow-relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-accent to-info"> <p class="text-white">Limit Office Hours tab</p> <img src="${linear}" alt="dummy image" width="1000" height="1000" class="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto" /> </div>`
		},
		{
			title: "Reputation",
			value: "reputation",
			content: `<div className="w-full overflow-relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-accent to-info"> <p class="text-white">Reputation tab</p> <img src="${linear}" alt="dummy image" width="1000" height="1000" class="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto" /> </div>`
		},
		{
			title: "Dashboard",
			value: "dashboard",
			content: `<div className="w-full overflow-relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-accent to-info"> <p class="text-white">Dashboard tab</p> <img src="${linear}" alt="dummy image" width="1000" height="1000" class="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto" /> </div>`
		}
	];
</script>

<section
	class="flex h-[50rem] w-full flex-col items-center justify-center bg-neutral-950 rounded-b-md">
	<h1 class="relative z-30 text-center text-5xl font-bold text-base-100 md:text-7xl lg:text-9xl">
		Class Connect
	</h1>
	<h2 class="relative z-30 text-center text-md text-neutral-400 md:text-xl lg:text-3xl mb-4">
		Making <span class="text-primary">Office Hours</span> Fast, Functional, and
		<span class="text-primary">Seamless</span>
	</h2>
	<!-- grid effect -->
	<div
		class="absolute z-20 h-full w-full [background-position:calc(100%+5px)_calc(100%+5px)] bg-fixed"
		style="background-image: url({grid})">
	</div>
	<div class="relative h-40 w-[40rem]">
		<!-- Glow Gradients -->
		<div
			class="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
		<div
			class="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-white to-transparent" />
		<div
			class="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
		<div
			class="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-primary to-transparent" />

		<Sparkles
			minSize={0.8}
			maxSize={2}
			particleDensity={300}
			className="w-full h-full z-30"
			particleColor="#f4f8fb" />

		<!-- Blur our sparkles -->
		<div
			class="absolute inset-0 h-full w-full z-0 bg-neutral-950 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]">
		</div>
	</div>
</section>

<section class="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
	<div class="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
		<div class="mx-auto max-w-lg lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
			<h2 class="text-3xl font-bold sm:text-4xl">
				Why <span class="text-primary font-semibold">Class Connect</span>
			</h2>

			<p class="mt-4 text-gray-600">
				An independant study project under UNC Charlote's College of Computing and Informatics,
				Class Connect is designed to facilitate efficient scheduling of office hours for students
				with their courses instructional teams.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-4">
			{#each cards as card}
				<div
					class="group block rounded-xl border border-gray-200 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring cursor-default">
					<span
						class="inline-block rounded-lg bg-gray-50 p-3 group-hover:bg-primary border border-gray-200 transition-colors duration-150 ease-in-out">
						<Icon src={card.icon} class="h-6 w-6 stroke-2 group-hover:stroke-base-100" />
					</span>

					<h3 class="mt-1 sm:mt-2 font-bold">{card.title}</h3>

					<p class="sm:mt-1 block text-sm text-neutral-500">
						{card.content}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Visuals/Screenshots of what the app looks like -->
<section
	class="relative mx-auto mb-40 flex h-[20rem] w-[80vw] max-w-5xl flex-col items-start justify-start [perspective:1000px] md:h-[40rem] lg:w-[60vw]">
	<Tabs
		propTabs={tabs}
		contentClassName="rounded-2xl bg-gradient-to-br from-accent to-info p-10 text-xl font-bold md:text-4xl mt-12"
		tabClassName="btn btn-ghost mr-2 border border-neutral"
		activeTabClassName="btn btn-active btn-secondary"
		activeTabTextClassName="text-white" />
</section>

<section class="max-w-screen-xl mx-auto my-16">
	<h2 class="text-3xl font-bold sm:text-4xl mb-6 text-center">Meet the Team</h2>
	<div class="grid grid-cols-2 gap-y-8 lg:grid-cols-3 lg:items-center lg:gap-x-16">
		{#each teamMembers as teamMember}
			<a href={teamMember.link} class="group">
				<div class="flex flex-col items-center">
					<div class="avatar">
						<div
							class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 group-hover:brightness-75 transition-all ease-in duration-100">
							<img src={teamMember.image} alt="{teamMember.name} Image" />
						</div>
					</div>
					<div class="flex flex-col items-center my-1">
						<h3 class="font-semibold">{teamMember.name}</h3>
						{#each teamMember.designation as designation}
							<div
								class="my-1 badge badge-outline group-hover:badge-primary group-hover:badge-outline transition-all ease-in duration-100">
								{designation}
							</div>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<section
	class="relative flex h-[40rem] w-full flex-col items-center justify-center rounded-t-md bg-neutral-950 px-32 antialiased">
	<div class="mx-auto max-w-2xl p-4">
		<h1
			class="relative z-10 bg-neutral-300 bg-clip-text text-center font-sans text-lg font-bold text-transparent md:text-7xl">
			Interested?
		</h1>
		<p class="relative z-10 mx-auto my-2 max-w-lg text-center text-sm text-neutral-500">
			If you're interested in trying Class Connect with your course or school, submit an email and
			we'll reach back out as soon as possible!
		</p>
		<form class="relative mt-4">
			<label for="Search" class="sr-only"> Search </label>
			<input
				type="text"
				id="Search"
				placeholder="hi@charlotte.edu"
				class="relative z-10 w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2 placeholder:text-neutral-500 focus:ring-2 focus:ring-primary text-white" />

			<span class="absolute z-20 inset-y-0 end-0 grid w-10 place-content-center">
				<button type="submit" class="text-neutral-500 hover:text-white">
					<span class="sr-only">Search</span>
					<Icon src={PaperAirplane} class="h-4 w-4 stroke-w" />
				</button>
			</span>
		</form>
	</div>
	<BackgroundBeams />
</section>
