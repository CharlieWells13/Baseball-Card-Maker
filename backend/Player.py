import pybaseball as pybaseball
import pandas as pd

class Player:
    def __init__(self, firstName, lastName, IDfg, firstYear, lastYear):
        self.firstName = firstName
        self.lastName = lastName
        self.IDfg = IDfg
        self.firstYear = firstYear
        self.lastYear = lastYear   

    def getBattingStats(self):
        try:
            df = pybaseball.batting_stats(self.firstYear, self.lastYear)#LATER, use qual to set if needs to qualify or not
            player_stats = df[df['IDfg'] == self.IDfg]
            if not player_stats.empty:
                return player_stats.sort_values(by="Season").reset_index(drop=True)
            else:
                return pd.DataFrame()
        except Exception as e:
            print(f"Failed to fetch batting stats: {e}")
            return pd.DataFrame()
     
    def getPitchingStats(self):
        try:
            df = pybaseball.pitching_stats(self.firstYear, self.lastYear)
            player_stats = df[df['IDfg'] == self.IDfg]
            if not player_stats.empty:
                return player_stats.sort_values(by="Season").reset_index(drop=True)
            else:
                return pd.DataFrame()
        except Exception as e:
            print(f"Failed to fetch pitching stats: {e}")
            return pd.DataFrame()
    


    



