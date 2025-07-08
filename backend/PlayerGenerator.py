import Player as Player
from pybaseball import playerid_lookup

class PlayerGenerator:
    
    def generatePlayer(self, firstName, lastName):
        try:
            df = playerid_lookup(lastName, firstName)
            player = Player.Player(df['name_first'].iloc[0], df['name_last'].iloc[0], df['key_fangraphs'].iloc[0], df['mlb_played_first'].iloc[0], df['mlb_played_last'].iloc[0], df['key_mlbam'].iloc[0])
            return player
        except IndexError:
            print("Player not found.")
            raise IndexError
        except Exception as e:
            print("Something went wrong:", e)
            raise Exception

        