import { CustomizeScreen } from './components/CustomizeScreen'
import { GameScreen } from './components/GameScreen'
import { TitleScreen } from './components/TitleScreen'
import { useGame } from './game/useGame'

export default function App() {
  const {
    state,
    voicePack,
    setVoicePack,
    goTitle,
    openCustomize,
    updateBoss,
    startGame,
    deployPrank,
    pranks,
    meltdownGoal,
  } = useGame()

  if (state.screen === 'title') {
    return (
      <TitleScreen
        onStart={openCustomize}
        voicePack={voicePack}
        onVoicePack={setVoicePack}
      />
    )
  }

  if (state.screen === 'customize') {
    return (
      <CustomizeScreen
        boss={state.boss}
        voicePack={voicePack}
        onChange={updateBoss}
        onVoicePack={setVoicePack}
        onStart={startGame}
        onBack={goTitle}
      />
    )
  }

  return (
    <GameScreen
      state={state}
      pranks={pranks}
      meltdownGoal={meltdownGoal}
      voicePack={voicePack}
      onVoicePack={setVoicePack}
      onPrank={deployPrank}
      onCustomize={openCustomize}
    />
  )
}
