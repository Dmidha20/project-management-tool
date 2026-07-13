export default function TableNoData() {
  return (
    <tr>
      <td colSpan={12} className="py-4">
        <p className="text-center text-gray-500">{'No Record'}</p>
      </td>
    </tr>
  );
}
