-- Includes
local g = require("racing_plus/globals")
local ShadowClient = require("racing_plus/shadowclient")

local Shadow = {
  beaconInterval = 10 * 60, -- 60 fps per "Isaac.GetFrameCount()"
  sprite = nil,
  head = nil,
  body = nil,
  isActive = false,
}

local state = {
  lastUpdated = 0,
  x = nil,
  y = nil,
  level = nil,
  room = nil,
  character = nil,
  anim_name = nil,
  anim_frame = nil,
}

function Shadow:IsEnabled()
  return (
    g.luaDebug
    and g.raceVars.shadowEnabled
    and g.race.raceID ~= 0
    and g.race.status == 'in progress'
  )
end

function Shadow:Draw()
  if Shadow.body == nil and state.character ~= nil then
    Shadow.body = Sprite {}
    Shadow.body:Load("gfx/custom/characters/" ..state.character .. ".anm2", true)
    Shadow.body.Color = Color(1, 1, 1, 0.075, 0, 0, 0)
  end
  if Shadow.head == nil and state.character ~= nil then
    Shadow.head = Sprite {}
    Shadow.head:Load("gfx/custom/characters/" .. state.character .. ".anm2", true)
    Shadow.head.Color = Color(1, 1, 1, 0.075, 0, 0, 0)
  end

  if Shadow.isActive and g.r:GetFrameCount() > 0 then
    local shadowPos = Isaac.WorldToScreen(Vector(state.x, state.y))

    if #state.anim_name > 0 then
      if string.find(state.anim_name, "Trapdoor") then
        Shadow.head:SetFrame("Trapdoor", state.anim_frame)
        Shadow.body:SetFrame("Trapdoor", state.anim_frame)
      elseif string.find(state.anim_name, "Walk") then
        local headanim = string.gsub(state.anim_name, "Walk", "Head")
        Shadow.head:SetFrame(headanim, state.anim_frame)
        Shadow.body:SetFrame(state.anim_name, state.anim_frame)
      else
        Shadow.head:SetFrame(state.anim_name, state.anim_frame)
        Shadow.body:SetFrame(state.anim_name, state.anim_frame)
      end
      Shadow.head:Render(shadowPos, Vector.Zero, Vector.Zero)
    else
      Shadow.body:SetFrame("Death", 0)
    end

    Shadow.body:Render(shadowPos, Vector.Zero, Vector.Zero)
  end
end

function Shadow:IsBeaconFrame()
  local isaacFrameCount = Isaac:GetFrameCount()
  return isaacFrameCount - math.fmod(isaacFrameCount, Shadow.beaconInterval) == 0
end

function Shadow:PostUpdate()
  if not Shadow:IsEnabled() then
    return ShadowClient:Disconnect()
  end
  if not ShadowClient.connected then
    ShadowClient:Connect()
    ShadowClient:SendBeacon() -- Initial session start
  end

  if Shadow:IsBeaconFrame() then
    ShadowClient:SendBeacon()
  end

  ShadowClient:SendShadow()
  local shadow = ShadowClient:RecvOpponentShadow() -- Data may not be yet received
  Shadow.isActive = Shadow.isActive and shadow ~= nil

  if shadow == nil then
    return
  end

  -- Local variables
  local roomIndex = misc:getRoomIndex()
  local stage = g.l:GetStage()
  local currentFrame = Isaac:GetFrameCount()

  state.x = shadow.x
  state.y = shadow.y
  state.level = shadow.level
  state.room = shadow.room

  if Shadow.body ~= nil and state.character ~= shadow.character then
    Shadow.body:Load("gfx/custom/characters/" .. shadow.character .. ".anm2", true)
  end
  if Shadow.head ~= nil and state.character ~= shadow.character then
    Shadow.head:Load("gfx/custom/characters/" .. shadow.character .. ".anm2", true)
  end

  state.character = shadow.character
  state.anim_name = shadow.anim_name
  state.anim_frame = shadow.anim_frame

  Shadow.isActive = (
    shadow.level == stage -- Same level
    and shadow.room == roomIndex -- Same room
    and currentFrame - state.lastUpdated < 60
  )
  state.lastUpdated = currentFrame
end

return Shadow
