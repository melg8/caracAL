function AmIClass(class_type) {
    return character.ctype == class_type;
}

function AmIRanger() {
    return AmIClass("ranger");
}

function EnoughManaFor(skill_name) {
    return character.mp >= G.skills[skill_name].mp;
}

function ShouldHit(target) {
    if (character.name === "Lucky") {
        return true;
    }
    return target.hp > 20000;
}

function ShouldRelog(target) {
    return target.hp > 20000;
}


async function FarmWithSingleShotRelog(target_type) {
    await parent.transport_to("main", 9);
    await smart_move({x:-219, y:-506, map:"main"});
	
    let new_target = get_nearest_monster({
        no_target: false,
        path_check: false,
        type: target_type,
    });
    change_target(new_target);
    if (AmIRanger()) {
        if (!EnoughManaFor("huntersmark") &&
            !is_on_cooldown("use_mp")) {
            await use_skill("use_mp");
        }
        if (EnoughManaFor("huntersmark") && 
            new_target.s.marked == null &&
            !is_on_cooldown("huntersmark")) {
            let target = get_targeted_monster();
            if (target) {
                await use_skill("huntersmark");
            }
        }
        if (!EnoughManaFor("supershot") &&
            !is_on_cooldown("use_mp") ) {
            await use_skill("use_mp");
        } 
        if (EnoughManaFor("supershot") && 
            !is_on_cooldown("supershot") &&
            ShouldHit(new_target))  {
            let target = get_targeted_monster();
            if (target) {
                await use_skill("supershot");
                if (ShouldRelog(target)) {
                    //await change_server("EU", "I");
                    await parent.caracAL.deploy(null, "EUI");
                } else {
                    await parent.transport_to("winterland",1);
                }
           }
        }
    }
}

async function TeleportFarmLoop() {
    await FarmWithSingleShotRelog("redfairy");
    setTimeout(TeleportFarmLoop, 5000);
}

performance_trick();
TeleportFarmLoop();