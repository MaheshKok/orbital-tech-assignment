import { type IUsageResponse } from "../hooks/useUsage";

export default function UsageTable({ usage }: { usage: IUsageResponse }) {
	return (
		<table>
			<thead>
				<tr>
					<th>Message ID</th>
					<th>Timestamp</th>
					<th>Report Name</th>
					<th>Credits Used</th>
				</tr>
			</thead>
			<tbody>
				{usage &&
					usage.usage.map((item) => (
						<tr key={item.message_id}>
							<td>{item.message_id}</td>
							<td>{item.timestamp}</td>
							<td>{item.report_name}</td>
							<td>{item.credits_used} credits</td>
						</tr>
					))}
			</tbody>
		</table>
	);
}
