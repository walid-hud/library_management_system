import { select, input } from "@inquirer/prompts";
import { log } from "console";
const banner = `
██╗     ███╗   ███╗███████╗
██║     ████╗ ████║██╔════╝
██║     ██╔████╔██║███████╗
██║     ██║╚██╔╝██║╚════██║
███████╗██║ ╚═╝ ██║███████║
╚══════╝╚═╝     ╚═╝╚══════╝
Library management system

`;
// global counters to use as IDs
let GLOBAL_BOOKS_COUNTER = 1;
let GLOBAL_SUBSCRIBERS_COUNTER = 1;
let GLOBAL_LOANS_COUNTER = 1;
let GLOBAL_RETURNS_COUNTER = 1;
// storage
const books = [];
const subscribers = [];
const loans = [];
const returns = [];
// test data
const test_books = [
	{
		ID: GLOBAL_BOOKS_COUNTER++,
		title: "The Great Gatsby",
		author: "F. Scott Fitzgerald",
		pub_year: 1925,
		available: true,
	},
	{
		ID: GLOBAL_BOOKS_COUNTER++,
		title: "1984",
		author: "George Orwell",
		pub_year: 1949,
		available: true,
	},
	{
		ID: GLOBAL_BOOKS_COUNTER++,
		title: "To Kill a Mockingbird",
		author: "Harper Lee",
		pub_year: 1960,
		available: true,
	},
];
const test_subscribers = [
	{
		ID: GLOBAL_SUBSCRIBERS_COUNTER++,
		first_name: "Alice",
		last_name: "Johnson",
		email: "alice.johnson@example.com",
	},
	{
		ID: GLOBAL_SUBSCRIBERS_COUNTER++,
		first_name: "Bob",
		last_name: "Smith",
		email: "bob.smith@example.com",
	},
	{
		ID: GLOBAL_SUBSCRIBERS_COUNTER++,
		first_name: "Charlie",
		last_name: "Brown",
		email: "charlie.brown@example.com",
	},
];
books.push(...test_books);
subscribers.push(...test_subscribers);