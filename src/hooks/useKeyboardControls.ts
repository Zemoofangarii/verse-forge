import { useState, useEffect, useCallback } from "react";
import { MovementInput } from "@/types/game";

interface AttackInputs {
  punch: boolean;
  kick: boolean;
  weaponAttack: boolean;
}

export function useKeyboardControls() {
  const [movement, setMovement] = useState<MovementInput>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  const [attackInputs, setAttackInputs] = useState<AttackInputs>({
    punch: false,
    kick: false,
    weaponAttack: false,
  });
  const [isChatFocused, setIsChatFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isChatFocused) return;

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case "Space":
          e.preventDefault();
          setMovement((prev) => ({ ...prev, jump: true }));
          setAttackInputs((prev) => ({ ...prev, weaponAttack: true }));
          break;
        case "KeyQ":
          e.preventDefault();
          setAttackInputs((prev) => ({ ...prev, punch: true }));
          break;
        case "KeyE":
          e.preventDefault();
          setAttackInputs((prev) => ({ ...prev, kick: true }));
          break;
      }
    },
    [isChatFocused]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        setMovement((prev) => ({ ...prev, forward: false }));
        break;
      case "KeyS":
      case "ArrowDown":
        setMovement((prev) => ({ ...prev, backward: false }));
        break;
      case "KeyA":
      case "ArrowLeft":
        setMovement((prev) => ({ ...prev, left: false }));
        break;
      case "KeyD":
      case "ArrowRight":
        setMovement((prev) => ({ ...prev, right: false }));
        break;
      case "Space":
        setMovement((prev) => ({ ...prev, jump: false }));
        setAttackInputs((prev) => ({ ...prev, weaponAttack: false }));
        break;
      case "KeyQ":
        setAttackInputs((prev) => ({ ...prev, punch: false }));
        break;
      case "KeyE":
        setAttackInputs((prev) => ({ ...prev, kick: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { movement, attackInputs, setIsChatFocused, setAttackInputs };
}
