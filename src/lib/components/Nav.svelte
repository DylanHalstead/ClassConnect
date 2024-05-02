<script lang="ts">
	import { signOut } from "svelte-google-auth/client";
	import {
		Icon,
		User as UserIcon,
		Calendar,
		ArrowLeftEndOnRectangle,
		Squares2x2 as DashboardIcon,

		User

	} from "svelte-hero-icons";
	import type { User } from "$lib/types";

	export let data: {
		db:
			| {
					user: User;
			  }
			| undefined;
		// type built from svelte-google-auth/server types; cannot import to client
		auth: {
			client_id: string;
			user?: {
				iss: string;
				azp: string;
				aud: string;
				sub: string;
				hd: string;
				email: string;
				email_verified: string;
				at_hash: string;
				name: string;
				picture: string;
				given_name: string;
				family_name: string;
				locale: string;
				iat: string;
				exp: string;
			};
			access_token?: string;
		};
		userID: string | undefined;
	};
</script>

<div class="fixed z-50">
	<div class="flex flex-col justify-between bg-primary w-16 h-screen items-center">
		<div>
			<nav class="flex flex-col items-center space-y-10">
				<div class="bg-white w-12 m-5 h-12 rounded-xl flex items-center justify-center relative overflow-hidden">
					<div class="absolute inset-0 flex items-center justify-center">
						<!-- If not user show CC 'logo' -->
						{#if !data.auth.user}
							<a class="text-2xl font-bold" href="/">CC</a>
							<!-- Else show CC user pfp -->
						{:else}
							<img class="object-cover h-full w-full" src={data.auth.user.picture} alt="User Profile Pic" />
						{/if}
					</div>
				</div>

				<div class="space-y-14">
					<div>
						<a href="/dashboard"><Icon src={DashboardIcon} size="32" class="text-white" /></a>
					</div>
					{#if data.db}
					<div>
						<a href={`/profile/${data.db.user.id}`}><Icon src={UserIcon} size="32" class="text-white" /></a>
					</div>
					{/if}
					<div>
						<a href="/calendar"><Icon src={Calendar} size="32" class="text-white" /></a>
					</div>
				</div>
			</nav>
		</div>

		<div class="mb-5">
			<button
				on:click={async () => {
					await signOut();
					location.href = "/";
				}}><Icon src={ArrowLeftEndOnRectangle} size="32" class="text-white" /></button>
		</div>
	</div>
</div>
