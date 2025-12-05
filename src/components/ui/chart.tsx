"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

const TEMAS = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<keyof typeof TEMAS, string>
  }
}

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
}) {
  const chartId = `chart-${id || React.useId().replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-hidden",
          "[&_.recharts-sector]:outline-hidden",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color)
  
  if (!colorConfig.length) return null

  const cssVars = Object.entries(TEMAS)
    .map(([theme, prefix]) => {
      const vars = colorConfig
        .map(([key, cfg]) => {
          const color = cfg.theme?.[theme as keyof typeof cfg.theme] || cfg.color
          return color ? `  --color-${key}: ${color};` : null
        })
        .filter(Boolean)
        .join("\n")
      
      return `${prefix} [data-chart=${id}] {\n${vars}\n}`
    })
    .join("\n")

  return <style dangerouslySetInnerHTML={{ __html: cssVars }} />
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string | number
  className?: string
  indicator?: "line" | "dot" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode
  labelClassName?: string
  formatter?: (value: any, name: string, item: any, index: number) => React.ReactNode
  color?: string
  nameKey?: string
  labelKey?: string
}

function getItemConfig(config: ChartConfig, item: any, key: string) {
  const configKey = item?.payload?.[key] || item?.[key] || key
  return config[configKey] || config[key]
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) return null

  const getLabel = () => {
    if (hideLabel) return null
    
    const item = payload[0]
    const key = labelKey || item?.dataKey || item?.name || "value"
    const itemConfig = getItemConfig(config, item, key)
    const value = !labelKey && typeof label === "string"
      ? config[label]?.label || label
      : itemConfig?.label

    if (labelFormatter) {
      return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
    }
    
    return value ? <div className={cn("font-medium", labelClassName)}>{value}</div> : null
  }

  const tooltipLabel = getLabel()
  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload.filter((item) => item.type !== "none").map((item, index) => {
          const key = nameKey || item.name || item.dataKey || "value"
          const itemConfig = getItemConfig(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            <div
              key={item.dataKey}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : !hideIndicator && (
                    <div
                      className={cn("shrink-0 rounded-[2px]", {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed",
                      })}
                      style={{ backgroundColor: indicatorColor, borderColor: indicatorColor }}
                    />
                  )}
                  <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
                    <div className="grid gap-1.5">
                      {nestLabel && tooltipLabel}
                      <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                    </div>
                    {item.value && (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  payload?: any[]
  verticalAlign?: "top" | "bottom"
  hideIcon?: boolean
  nameKey?: string
}) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.filter((item) => item.type !== "none").map((item) => {
        const key = nameKey || item.dataKey || "value"
        const itemConfig = getItemConfig(config, item, key)

        return (
          <div key={item.value} className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground">
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }

