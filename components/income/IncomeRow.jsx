export default function IncomeRow({ item, onDeactivate }) {
  return (
    <tr className="border-t">
      <td className="px-5 py-4 font-medium">{item.sourceName}</td>
      <td className="px-5 py-4">₹ {item.amount}</td>
      <td className="px-5 py-4">{item.frequency || "Monthly"}</td>

      <td className="px-5 py-4">
        {item.isActive ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            Active
          </span>
        ) : (
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
            Inactive
          </span>
        )}
      </td>

      <td className="px-5 py-4 text-right">
        {item.isActive && (
          <button
            onClick={() => onDeactivate(item._id)}
            className="text-red-600 hover:text-red-800"
          >
            Deactivate
          </button>
        )}
      </td>
    </tr>
  );
}
