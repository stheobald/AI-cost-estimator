"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [inputs, setInputs] = useState({
    baseServerCost: 300,
    inputTokenCost: 5,
    outputTokenCost: 15,
    avgInputTokens: 186,
    avgOutputTokens: 420,
    ingestionCost: 0.20,
    filesPerWeek: 10,
    avgFileSize: 2,
    numUsers: 100,
    questionsPerWeek: 50
  })

  const [outputs, setOutputs] = useState({
    tokenCostPerUser: 0,
    totalCostPerUser: 0,
    totalStorageDemand: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  useEffect(() => {
    const tokenCostPerQuestion = 
      (inputs.avgInputTokens * inputs.inputTokenCost / 1000000) + 
      (inputs.avgOutputTokens * inputs.outputTokenCost / 1000000)
    
    const tokenCostPerUser = tokenCostPerQuestion * inputs.questionsPerWeek * 4 // Assuming 4 weeks per month
    
    const ingestionCostPerUser = 
      inputs.filesPerWeek * inputs.avgFileSize * inputs.ingestionCost * 4 // Assuming 4 weeks per month
    
    const totalCostPerUser = 
      tokenCostPerUser + 
      ingestionCostPerUser + 
      (inputs.baseServerCost / inputs.numUsers)
    
    const totalStorageDemand = 
      inputs.numUsers * inputs.filesPerWeek * inputs.avgFileSize * 4 // Assuming 4 weeks per month

    setOutputs({
      tokenCostPerUser: parseFloat(tokenCostPerUser.toFixed(2)),
      totalCostPerUser: parseFloat(totalCostPerUser.toFixed(2)),
      totalStorageDemand: parseFloat(totalStorageDemand.toFixed(2))
    })
  }, [inputs])

  const inputLabels = {
    baseServerCost: "Base Server/Infrastructure Cost per Month ($)",
    inputTokenCost: "Input Token Cost ($ per 1M tokens)",
    outputTokenCost: "Output Token Cost ($ per 1M tokens)",
    avgInputTokens: "Average Input Tokens per Question",
    avgOutputTokens: "Average Output Tokens per Question",
    ingestionCost: "File Ingestion Cost ($ per MB)",
    filesPerWeek: "Number of Files Uploaded per Week per User",
    avgFileSize: "Average File Size (MB)",
    numUsers: "Number of Users",
    questionsPerWeek: "Number of Questions per Week per User"
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Service Cost Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="mb-1 block">
                    {inputLabels[key as keyof typeof inputLabels]}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calculated Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="mb-1 block">Token Cost per User per Month</Label>
                <div className="text-2xl font-bold">${outputs.tokenCostPerUser}</div>
              </div>
              <div>
                <Label className="mb-1 block">Total Cost per User per Month</Label>
                <div className="text-2xl font-bold">${outputs.totalCostPerUser}</div>
              </div>
              <div>
                <Label className="mb-1 block">Total Additional Storage Demand per Month (MB)</Label>
                <div className="text-2xl font-bold">{outputs.totalStorageDemand}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}