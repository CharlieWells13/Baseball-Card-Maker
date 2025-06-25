import Player
import PlayerGenerator

if __name__ == "__main__":
    generator = PlayerGenerator.PlayerGenerator()
    player = generator.generatePlayer("Brent", "Rooker")
    if player:
        print(player.getBattingStats())
        print(player.getPitchingStats())
    else:
        print("Player generation failed.")
