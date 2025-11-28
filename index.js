import { select, input } from "@inquirer/prompts";
import { log } from "console";
const banner = `
██╗     ███╗   ███╗███████╗
██║     ████╗ ████║██╔════╝
██║     ██╔████╔██║███████╗
██║     ██║╚██╔╝██║╚════██║
███████╗██║ ╚═╝ ██║███████║
╚══════╝╚═╝     ╚═╝╚══════╝
Library Management System

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
// functions
async function manage_books() {
	let return_to_menu = false;
	const choices_array = [
		"add a book",
		"add multiple books",
		"show all books",
		"sort books",
		"find book by ID",
		"return to main menu",
	];
	while (!return_to_menu) {
		const answer = await select({
			message: "choose operation",
			choices: choices_array,
			theme: { indexMode: "number" },
		});
		switch (answer) {
			case choices_array[0]:
				await register_book();
				break;
			case choices_array[1]:
				await register_multiple_books();
				break;
			case choices_array[2]:
				if (books.length > 0) {
					books.map(log_book_details);
				} else {
					log("no books added yet!");
				}
				break;
			case choices_array[3]:
				await display_sorted_books();
				break;
			case choices_array[4]:
				await find_book_by_ID();
				break;
			case "return to main menu":
				return_to_menu = false;
				return;
		}
	}
}
async function register_book() {
	let new_book = {
		ID: GLOBAL_BOOKS_COUNTER++,
		title: await input({ message: "enter book title : ", required: true }),
		author: await input({
			message: "enter book author : ",
			required: true,
		}),
		pub_year: Number(
			await input({
				message: "enter publication year : ",
				required: true,
				validate: (value) => {
					if (Number.isNaN(parseInt(value)) || Number(value) < 0) {
						return "please enter a valid number!";
					} else {
						return true;
					}
				},
			})
		),
		available: true,
	};
	books.push(new_book);
	log(`\n ${new_book.title} added !\n`);
	return;
}
async function register_multiple_books() {
	const amount_of_books = Number(
		await input({
			message: "how many books you want to add : (0 to exit) ",
			required: true,
		})
	);
	if (amount_of_books === 0) {
		return;
	}
	for (let i = 1; i <= amount_of_books; i++) {
		await register_book();
	}
	log(`\n added ${amount_of_books} book(s) successfully !\n`);
	return;
}
async function display_sorted_books() {
	if (books.length === 0) {
		log("\n no books added yet!\n");
		return;
	}
	let return_to_menu = false;
	const sort_types = [
		"title",
		"year of publication(newest to oldest)",
		"available only",
		"return",
	];
	while (!return_to_menu) {
		const sort_type = await select({
			message: "sort by : ",
			choices: sort_types,
		});
		switch (sort_type) {
			case "return":
				return_to_menu = true;
				break;
			case sort_types[0]:
				await sort_books_by(sort_types[0]);
				break;
			case sort_types[1]:
				await sort_books_by(sort_types[1]);
				break;
			case sort_types[2]:
				await sort_books_by(sort_types[2]);
				break;
			default:
				break;
		}
	}
}
async function sort_books_by(sort_type) {
	let sorted_books = [];
	if (sort_type === "title") {
		let sort_method = await select({
			message: "",
			choices: ["ascending", "descending"],
		});
		if (sort_method === "ascending") {
			sorted_books = books.toSorted((book_a, book_b) => {
				return book_a.title.localeCompare(book_b.title);
			});
		} else {
			sorted_books = books.toSorted((book_a, book_b) => {
				return book_b.title.localeCompare(book_a.title);
			});
		}
	} else if (sort_type === "year of publication(newest to oldest)") {
		sorted_books = books.toSorted((book_a, book_b) => {
			return book_b.pub_year - book_a.pub_year;
		});
	} else if (sort_type === "available only") {
		sorted_books = books.filter((book) => {
			return book.available === true;
		});
		if (sorted_books.length === 0) {
			log(`\nno books available currently!\n`);
			return;
		}
	}
	sorted_books.map(log_book_details);
	// could also be written as : sorted_books.map(book => log_book_details(book))
}
async function find_book_by_ID() {
	if (books.length === 0) {
		log("\n no books added yet!\n");
		return;
	}
	let id = Number(
		await input({
			message: "enter book ID : ",
			required: true,
			validate: (value) => {
				let value_as_number = Number(value);
				if (isNaN(value_as_number) || value_as_number <= 0) return "invalid id !";
				return true;
			},
		})
	);
	let searched_book = books.find((book) => book.ID === id);
	if (searched_book) {
		log_book_details(searched_book); //
	} else {
		log(`\n no book with ID : ${id} found! \n`);
	}
}
function log_book_details(book) {
	log(`
id : ${book.ID}
title : ${book.title}
author : ${book.author}
year of publication : ${book.pub_year}
available : ${book.available ? "yes" : "no"}
`);
}
async function manage_subscribers() {
	let return_to_menu = false;
	const choices_array = ["add subscriber", "show all subscribers", "return"];
	while (!return_to_menu) {
		let choice = await select({
			message: "choose operation",
			choices: choices_array,
		});
		switch (choice) {
			case choices_array[0]:
				await add_subscriber();
				break;
			case choices_array[1]:
				show_subscribers();
				break;
			case "return":
				return_to_menu = true;
				break;
			default:
				break;
		}
	}
}
async function add_subscriber() {
	const first_name = await input({
		message: "enter first name : ",
		required: true,
	});
	const last_name = await input({
		message: "enter last name : ",
		required: true,
	});
	const email = await input({
		message: "enter email : ",
		required: true,
		validate: (value) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return (
				emailRegex.test(value) || "Please enter a valid email address"
			);
		},
	});
	subscribers.push({
		first_name,
		last_name,
		email,
		ID: GLOBAL_SUBSCRIBERS_COUNTER++,
	});
	log("\n subscriber added successfully ! \n");
	return;
}
function show_subscribers() {
	if (subscribers.length === 0) {
		log("no subscribers exist yet! ");
		return;
	}
	log("\n subscribers \n");
	subscribers.map((subscriber) => {
		log(`
ID : ${subscriber.ID}
first name : ${subscriber.first_name}
last name : ${subscriber.last_name}
email : ${subscriber.email}
`);
	});
}
async function manage_loans() {
	let return_to_menu = false;
	const choices_array = [
		"register a book loan ",
		"register a book return",
		"show subscriber's loans",
		"return",
	];
	while (!return_to_menu) {
		const answer = await select({
			message: "choose operation",
			choices: choices_array,
		});
		switch (answer) {
			case choices_array[0]:
				await register_loan_record();
				break;
			case choices_array[1]:
				await register_return_record();
				break;
			case choices_array[2]:
				await show_subscriber_loans();
				break;
			case "return":
				return_to_menu = true;
				break;
		}
	}
}
async function register_loan_record() {
	log("[type c to cancel operation]");
	const subscriber_input = await input({
		message: "enter subscriber id : ",
		required: true,
		validate: (value) => {
			if (value === "c") return true;
			const subscriber_id_as_number = Number(value);
			if (
				subscriber_id_as_number < 0 ||
				subscriber_id_as_number > subscribers.length
			) {
				return "invalid subscriber ID";
			}
			if (
				subscribers.find(
					(subscriber) => (subscriber.ID = subscriber_id_as_number)
				) !== undefined
			) {
				return true;
			} else {
				return `no subscriber with id : ${value} exist`;
			}
		},
	});
	if (subscriber_input === "c") {
		log("operation canceled");
		return;
	}
	const subscriber_id = Number(subscriber_input);

	const book_id_input = await input({
		message: "enter book id : ",
		required: true,
		validate: (value) => {
			if (value === "c") {
				return true;
			}
			const id = Number(value);
			if (id < 0) {
				return "invalid book id : ";
			}
			const book = books.find((book) => book.ID === id);
			const is_book_already_loaned = get_subscriber_loans(
				subscriber_id
			).find((loan) => loan.book_id === id);
			if (!book) {
				return `no book with id : ${value} exist`;
			}
			if (!book.available) {
				return `book with id : ${value} is currently unavailable!`;
			}

			if (is_book_already_loaned && book.is_returned) {
				return `book with id : ${value} is already loaned to this subscriber `;
			}
			return true;
		},
	});

	if (book_id_input === "c") {
		log("operation canceled");
		return;
	}
	const book_id = Number(book_id_input);

	const loan_date = new Date().toDateString();
	loans.push({
		book_id,
		subscriber_id,
		loan_date,
		ID: GLOBAL_LOANS_COUNTER++,
		is_returned: false,
	});
	log("\n book loan registered successfully ! \n");
	books.map((book) => {
		if (book.ID === book_id) {
			book.available = false;
		}
	});
	return;
}
async function register_return_record() {
	log("[type c to cancel operation]");
	const subscriber_input = await input({
		message: "enter subscriber id : ",
		required: true,
		validate: (value) => {
			if (value === "c") return true;
			const subscriber_id_as_number = Number(value);
			if (
				subscriber_id_as_number < 0 ||
				subscriber_id_as_number > subscribers.length
			) {
				return "invalid subscriber ID";
			}
			if (
				subscribers.find(
					(subscriber) => (subscriber.ID = subscriber_id_as_number)
				) !== undefined
			) {
				return true;
			} else {
				return `no subscriber with id : ${value} exist`;
			}
		},
	});
	if (subscriber_input === "c") {
		log("operation canceled");
		return;
	}
	const subscriber_id = Number(subscriber_input);
	const book_id_input = await input({
		message: "enter book id : ",
		required: true,
		validate: (value) => {
			if (value === "c") return true;
			const id = Number(value);
			if (id < 0) {
				return "invalid book id : ";
			}
			const book = books.find((book) => book.ID === id);
			const is_book_loaned_to_user = get_subscriber_loans(
				subscriber_id
			).find((loan) => loan.book_id === id);
			if (!book) {
				return `no book with id : ${value} exists `;
			}
			if (book.available) {
				return `book with id : ${value} is already returned!`;
			}
			if (!is_book_loaned_to_user) {
				return `book with id : ${value} is NOT loaned to subscriber with id : ${subscriber_id}`;
			}
			return true;
		},
	});
	if (book_id_input === "c") {
		log("operation canceled");
		return;
	}
	const book_id = Number(book_id_input);
	const return_date = new Date().toDateString();
	returns.push({
		book_id,
		subscriber_id,
		return_date,
		ID: GLOBAL_RETURNS_COUNTER++,
	});
	loans.find(
		(loan) =>
			loan.book_id === book_id && loan.subscriber_id === subscriber_id
	).is_returned = true;
	log("\n book return registered successfully ! \n");
	books.find((book) => book.ID === book_id).available = true;
	return;
}
function get_subscriber_loans(subscriber_id) {
	return loans.filter((loan) => loan.subscriber_id === subscriber_id);
}
async function show_subscriber_loans() {
	if (loans.length === 0) {
		log("\n no loan records exist yet!\n");
		return;
	}
	const subscriber_id = Number(
		await input({
			message: "enter subscriber id: ",
			required: true,
			validate: (value) => {
				const subscriber_id_as_number = Number(value);
				if (
					subscribers.find(
						(subscriber) =>
							subscriber.ID === subscriber_id_as_number
					) !== undefined
				) {
					return true;
				} else if (
					subscriber_id_as_number > subscribers.length ||
					subscriber_id_as_number < 0
				) {
					return "invalid id ";
				}
			},
		})
	);
	const subscriber = subscribers.find(
		(subscriber) => subscriber.ID === subscriber_id
	);
	const subscriber_loans = loans.filter(
		(loan) => loan.subscriber_id === subscriber_id
	);
	if (subscriber_loans.length > 0) {
		const borrowed_books = [];
		subscriber_loans.map((loan) => {
			books.map((book) => {
				if (book.ID === loan.book_id) {
					borrowed_books.push(book);
				}
			});
		});
		log(
			`\nsubscriber : ${subscriber.first_name} ${subscriber.last_name}\n`
		);
		log("loans : ");
		subscriber_loans.map((loan, index) => {
			log(`
book title : ${borrowed_books[index].title}
book id    : ${borrowed_books[index].ID}
loan date  : ${loan.loan_date}
returned   : ${loan.is_returned} 
`);
		});
	} else {
		log(
			`subscriber ${subscriber.first_name} ${subscriber.last_name} has no book loans!`
		);
	}
}

// main program
log(banner);
let exit_program = false;
while (!exit_program) {
	let answer = await select({
		message: "select an option :",
		choices: ["manage books", "manage subscribers", "manage loans", "exit"],
	});
	switch (answer) {
		case "exit":
			exit_program = true;
			break;
		case "manage books":
			await manage_books();
			break;
		case "manage subscribers":
			await manage_subscribers();
			break;
		case "manage loans":
			await manage_loans();
			break;
		default:
			break;
	}
}
