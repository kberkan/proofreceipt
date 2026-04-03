import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    agentName: process.env.OWS_AGENT_NAME || "proof-agent",
    agentAddress: process.env.OWS_AGENT_ADDRESS || "Not configured",
    walletProvider: "Open Wallet Stack",
    signingMode: "Policy-gated signing without exposing private keys",
  });
}