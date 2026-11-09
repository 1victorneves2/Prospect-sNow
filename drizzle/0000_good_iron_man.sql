CREATE TABLE `opportunities` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`place_id` text NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `opportunities_owner_place` ON `opportunities` (`owner_id`,`place_id`);--> statement-breakpoint
CREATE TABLE `search_limits` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`last_search` integer NOT NULL,
	`count` integer NOT NULL
);
