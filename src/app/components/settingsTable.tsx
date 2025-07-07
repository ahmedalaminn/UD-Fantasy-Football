export const SettingsTable = ({ data } : { data: Record<string, any> }) => {
  return (
    <div className = "grid grid-cols-2 gap-x-60">
      {Object.entries(data).map(([key, value]) => (
        <div key = {key} className = "flex justify-center font-mono whitespace-nowrap">
          {key}: {String(value)}
        </div>
      ))}
    </div>
  )
}