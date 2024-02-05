var AbilityCalculator = {
	getPower: function(unit, weapon) {
		var pow;
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			// Physical attack or Bow attack.
			pow = RealBonus.getStr(unit);
		}
		else {
			// Magic attack
			pow = RealBonus.getMag(unit);
		}
		
		// Atk formula. Weapon pow + (Pow or Mag)
		return pow + weapon.getPow();
	},
	getHit: function(unit, weapon) {
		// Hit rate formula. Weapon hit rate + (Ski * 3)
		return weapon.getHit() + (RealBonus.getSki(unit) * 5 + RealBonus.getLuk(unit) * 1.5);
	},
	
	getAvoid: function(unit) {
		var avoid, terrain;
		var cls = unit.getClass();
		
		// Avoid is (Spd * 2)
		avoid = (RealBonus.getSpd(unit) * 5 + RealBonus.getLuk(unit) * 1.5);
		
		// If class type gains terrain bonus, add the avoid rate of terrain.
		if (cls.getClassType().isTerrainBonusEnabled()) {
			terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
			if (terrain !== null) {
				avoid += terrain.getAvoid();
			}
		}
		
		return avoid;
	},
	
	getCritical: function(unit, weapon) {
		// Critical rate formula. Ski + Weapon critical rate
		return RealBonus.getSki(unit)*1.5 + weapon.getCritical();
	},
	
	getCriticalAvoid: function(unit) {
		// Luk is a critical avoid rate.
		return RealBonus.getLuk(unit)*3;
	},
	
	getAgility: function(unit, weapon) {
		var agi, value, param;
		var spd = RealBonus.getSpd(unit);
		
		// Normally, agility is identical with spd.
		agi = spd;
		
		// If a weapon is not specified or the weight is not included, agility doesn't change.
		if (weapon === null || !DataConfig.isItemWeightDisplayable()) {
			return agi;
		}
		
		// If bld is enabled, decide with bld. Otherwise, decide with pow (mag).
		if (DataConfig.isBuildDisplayable()) {
			param = ParamBonus.getBld(unit);
		}
		else {
			if (Miscellaneous.isPhysicsBattle(weapon)) {
				param = ParamBonus.getStr(unit);
			}
			else {
				param = ParamBonus.getMag(unit);
			}
		}
		
		value = weapon.getWeight() - param;
		if (value > 0) {
			// If a parameter is lower than the weight, lower the agility according to the difference.
			agi -= value;
		}
		
		return agi;
	}
};
