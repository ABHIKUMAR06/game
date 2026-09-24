import { CustomizeScreen } from './components/CustomizeScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'
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
    suspicionLimit,
  } = useGame()

  if (state.screen === 'title') {
    return <TitleScreen onStart={openCustomize} />
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

  if (state.screen === 'won' || state.screen === 'lost') {
    return (
      <ResultScreen
        won={state.screen === 'won'}
        score={state.score}
        message={state.message}
        onRetry={openCustomize}
        onTitle={goTitle}
      />
    )
  }

  return (
    <GameScreen
      state={state}
      pranks={pranks}
      meltdownGoal={meltdownGoal}
      suspicionLimit={suspicionLimit}
      voicePack={voicePack}
      onVoicePack={setVoicePack}
      onPrank={deployPrank}
      onCustomize={openCustomize}
    />
  )
}
