const fallback = `--METADATA--{"filename":"SprintController.lua","path":"StarterPlayerScripts"}--METADATA--

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local sprinting = false
local stamina = 100
local maxStamina = 100
local sprintSpeed = 22
local walkSpeed = 16

local function updateSpeed()
    humanoid.WalkSpeed = sprinting and sprintSpeed or walkSpeed
end

local function handleInput(input, gameProcessed)
    if gameProcessed then
        return
    end

    if input.KeyCode == Enum.KeyCode.LeftShift then
        sprinting = not sprinting
        updateSpeed()
    end
end

UserInputService.InputBegan:Connect(handleInput)
UserInputService.InputEnded:Connect(function(input)
    if input.KeyCode == Enum.KeyCode.LeftShift then
        sprinting = false
        updateSpeed()
    end
end)

RunService.RenderStepped:Connect(function(dt)
    if sprinting and stamina > 0 then
        stamina = math.max(0, stamina - 25 * dt)
    elseif not sprinting and stamina < maxStamina then
        stamina = math.min(maxStamina, stamina + 18 * dt)
    end

    if sprinting and stamina <= 0 then
        sprinting = false
        updateSpeed()
    end
end)

while true do
    task.wait(0.1)
    if humanoid then
        humanoid.WalkSpeed = sprinting and (stamina > 0 and sprintSpeed or walkSpeed) or walkSpeed
    end
end
`;

export const FALLBACK_CODE = fallback;
