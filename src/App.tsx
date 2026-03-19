import { BackgroundAmbient } from "./components/layout/BackgroundAmbient";
import { AirQualityCard } from "./components/dashboard/AirQualityCard";
import { HygieneMeter } from "./components/dashboard/HygieneMeter";
import { HumidityCard } from "./components/dashboard/HumidityCard";
import { Controls } from "./components/dashboard/Controls";
import { StatusBar } from "./components/dashboard/StatusBar";
import { useMockSensors } from "./hooks/useMockSensors";

export default function App() {
  const {
    data,
    history,
    cleaningActive,
    ventilationOn,
    hygieneAlert,
    alertThreshold,
    actions,
  } = useMockSensors();

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-black bg-hero-gradient" />
      <BackgroundAmbient />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(56,189,248,0.18),transparent_60%)] opacity-80" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-10">
        <StatusBar
          cleaningActive={cleaningActive}
          ventilationOn={ventilationOn}
          showAlert={hygieneAlert}
        />

        <div className="mt-6">
          <Controls
            cleaningActive={cleaningActive}
            ventilationOn={ventilationOn}
            onTriggerCleaning={actions.triggerCleaning}
            onToggleExhaustFan={actions.toggleExhaustFan}
            onReset={actions.resetSystem}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[0.85fr_1.15fr_0.85fr] md:items-stretch">
          <div>
            <AirQualityCard airQuality={data.airQuality} />
          </div>

          <div>
            <HygieneMeter
              hygieneScore={data.hygieneScore}
              history={history}
              hygieneAlert={hygieneAlert}
              threshold={alertThreshold}
            />
          </div>

          <div>
            <HumidityCard humidity={data.humidity} />
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400/80">
          Mock real-time sensor feed with smooth spring needle animation.
        </div>
      </div>
    </div>
  );
}

