import { platformStrategies } from "../strategies/validationStrategies";

export default function PlatformSelector({ platform, onChange }) {
  return (
    <div className="field-group">
      <label htmlFor="platform-select">Platform</label>
      <select
        id="platform-select"
        value={platform}
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.entries(platformStrategies).map(([key, strategy]) => (
          <option key={key} value={key}>
            {strategy.label}
          </option>
        ))}
      </select>
    </div>
  );
}
