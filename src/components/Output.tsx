import { useState } from "react";

import type { Embed } from "../lib/interfaces";
import { embedToObjectCode } from "../lib/utils";
import Highlight from "./Highlight";

function s(strings: TemplateStringsArray, ...values: string[]) {
	let escaped = "";

	for (let i = 0; i < strings.length; i++) {
		if (i > 0) {
			escaped += JSON.stringify(values[i - 1]);
		}
		escaped += strings[i];
	}

	return escaped;
}

export default function Output({ embed }: { embed: Embed }) {
	const [language, setLanguage] = useState<"json" | "js" | "py">("json");
	const [jsVersion, setJsVersion] = useState("14");
	const [jsMode, setJsMode] = useState("chained");

	let output = "";

	if (language === "json") {
		output = embedToObjectCode(embed, false);
	} else {
		const kwargs = [];

		if (embed.title) kwargs.push(`{title: ${embed.title}}\n`.replace(/(^"|"$)/g, ''));
		if (embed.url) kwargs.push(`{url: ${embed.url}}\n`);
		if (embed.description) kwargs.push(`{description: ${`${embed.description}`.replace(/(^"|"$)/g, '')}}\n`);
		if (embed.color)
			kwargs.push(`{color: ${embed.color}}\n`.replace(/(^"|"$)/g, ''));
		if (embed.timestamp) kwargs.push(`{timestamp}\n`);

		output += `${kwargs.join(``)}`

		if (embed.author.name || embed.author.url || embed.author.iconUrl) {
			const kwargs = [];

			if (embed.author.name) kwargs.push(`{author.name: ${embed.author.name}}\n`.replace(/(^"|"$)/g, ''));
			if (embed.author.url) kwargs.push(`{author.url: ${embed.author.url}}\n`.replace(/(^"|"$)/g, ''));
			if (embed.author.iconUrl)
				kwargs.push(`{author.iconUrl: ${embed.author.iconUrl}}\n`.replace(/(^"|"$)/g, ''));

			output += `${kwargs.join(``)}`;
		}

		if (embed.fields.length > 0) {
			for (const field of embed.fields) {
				if (field.inline) {
					output += `{field: ${field.name} && ${field.value} && true}\n`.replace(/(^"|"$)/g, '')
					continue
				}
				output += `{field: ${field.name} && ${field.value}}\n`.replace(/(^"|"$)/g, '')
			}
		}

		if (embed.image) output += `{image: ${embed.image}}\n`.replace(/(^"|"$)/g, '');

		if (embed.thumbnail)
			output += `{thumbnail: ${embed.thumbnail}}\n`.replace(/(^"|"$)/g, '');

		if (embed.footer.text || embed.footer.iconUrl) {
			if (embed.footer.text) output += `{footer.text: ${embed.footer.text}}\n`.replace(/(^"|"$)/g, '');
			if (embed.footer.iconUrl) output += `{footer.iconUrl: ${embed.footer.iconUrl}}\n`.replace(/(^"|"$)/g, '');
		}
	}

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-white">Output</h2>

			<div className="flex my-2 gap-2">
				<select
					name="language"
					id="language"
					value={language}
					onChange={e => setLanguage(e.target.value as "js" | "py")}
				>
					<option value="json">JSON</option>
					<option value="code">Embed Code</option>
				</select>
			</div>

			<Highlight
				language={language === "json" ? "js" : language}
				className="rounded text-sm"
			>
				{output}
			</Highlight>
		</div>
	);
}
