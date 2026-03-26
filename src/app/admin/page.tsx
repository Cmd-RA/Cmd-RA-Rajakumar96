"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Users, 
  Flag, 
  ShieldAlert, 
  Star, 
  Trash2, 
  Ban,
  Settings2,
  Code2
} from "lucide-react"

export default function AdminPage() {
  const stats = [
    { label: "कुल यूज़र", value: "12,450", icon: Users },
    { label: "कुल पोस्ट", value: "45,892", icon: BarChart3 },
    { label: "फ्लैग किए गए", value: "24", icon: ShieldAlert },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 md:pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-headline">एडमिन कंट्रोल पैनल</h1>
          <Badge variant="outline" className="border-primary text-primary">
            राज कुमार
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold font-headline">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                AdSense इंटीग्रेशन
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                यहाँ अपना Google AdSense कोड पेस्ट करें ताकि यूज़र के फीड में विज्ञापन दिख सकें।
              </p>
              <textarea 
                className="w-full h-32 p-3 text-xs font-mono bg-muted rounded-md border"
                placeholder="<!-- AdSense script code here -->"
              />
              <Button className="w-full">सेटिंग्स सेव करें</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                प्लेटफॉर्म सेटिंग्स
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">मुद्रीकरण (Monetization)</span>
                <Badge className="bg-green-500">चालू</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">AI ऑटो-मॉडरेशन</span>
                <Badge className="bg-primary">सक्रिय</Badge>
              </div>
              <Button variant="outline" className="w-full">अन्य सेटिंग्स</Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Table */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">हालिया फ्लैग किए गए पोस्ट</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>यूज़र</TableHead>
                  <TableHead>कारण</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead className="text-right">एक्शन</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">यूज़र_{i}42</TableCell>
                    <TableCell className="text-xs text-muted-foreground">AI: स्पैम/अनुचित</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="text-[10px]">रिव्यू की ज़रूरत</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  )
}