import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/frequency-modulation-spectrum.png" alt="Avatar" />
          <AvatarFallback>FM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Fatima Mohammed</p>
          <p className="text-sm text-muted-foreground">2 Kanduras (Custom)</p>
        </div>
        <div className="ml-auto font-medium">AED 1,250</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/abstract-am.png" alt="Avatar" />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ahmed Al Mansouri</p>
          <p className="text-sm text-muted-foreground">1 Abaya (Ready-made)</p>
        </div>
        <div className="ml-auto font-medium">AED 450</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/abstract-geometric-lk.png" alt="Avatar" />
          <AvatarFallback>LK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Layla Khan</p>
          <p className="text-sm text-muted-foreground">3 Scarves (Ready-made)</p>
        </div>
        <div className="ml-auto font-medium">AED 350</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/ha-characters.png" alt="Avatar" />
          <AvatarFallback>HA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Hassan Al Farsi</p>
          <p className="text-sm text-muted-foreground">5 Kanduras (Bulk Order)</p>
        </div>
        <div className="ml-auto font-medium">AED 2,500</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/abstract-geometric-sa.png" alt="Avatar" />
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sara Al Ameri</p>
          <p className="text-sm text-muted-foreground">1 Custom Abaya (Rush)</p>
        </div>
        <div className="ml-auto font-medium">AED 850</div>
      </div>
    </div>
  )
}
