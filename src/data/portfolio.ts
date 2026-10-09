/**
 * Single source of truth for the portfolio content.
 * Edit text / links here — no need to touch the components.
 *
 * ⚠️ Items marked TODO are placeholders that must be replaced with real values.
 */

// ───────────────────────── Profile & contact ─────────────────────────

export const profile = {
  name: 'Ibrahim Zaki',
  role: 'Network Engineer',
  email: 'ibrahimahmed414243@gmail.com', // TODO: real email
  location: 'Cairo, Egypt', // TODO: real location
  /** Put the real PDF in /public and keep this file name (or change it here). */
  cvUrl: '/Ibrahim-Zaki-CV.pdf', // TODO: add public/Ibrahim-Zaki-CV.pdf
  /** TODO: the temporary builder.io URL will expire → save the photo in src/assets and import it. */
  photo:
    '/photo.png', // TODO: add public/photo.png or import from src/assets
} as const

/** TODO: replace with the real profile links. */
export const socials = {
  facebook: 'https://www.facebook.com/ibrahim.ahmed.317468',
  whatsapp: 'https://wa.me/+201118225000',
  linkedin: 'https://www.linkedin.com/in/ibrahim-ahmed-8aa9b738b/',
} as const

export const inquiryTypes = [
  'Consulting & Architecture',
  'Infrastructure Optimization',
  'Troubleshooting',
] as const

export type InquiryType = (typeof inquiryTypes)[number]

// ───────────────────────── Case studies ─────────────────────────

export type ProjectStatus = 'Live' | 'In Progress' | 'Archive'

export type NodeKind = 'router' | 'switch' | 'firewall' | 'cloud' | 'site'

export interface TopologyNode {
  id: string
  label: string
  sub?: string
  kind: NodeKind
  x: number
  y: number
}

export interface TopologyLink {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export interface Project {
  slug: string
  status: ProjectStatus
  tagline: string
  title: string
  /** Short description used on the card. */
  summary: string
  tags: string[]
  image: string
  imageAlt: string
  role: string
  overview: string
  challenge: string
  approach: { title: string; text: string }[]
  outcomes: string[]
  stack: { group: string; items: string[] }[]
  topology: { caption: string; nodes: TopologyNode[]; links: TopologyLink[] }
  config: { filename: string; language: string; note: string; code: string }
}

export const statusColors: Record<ProjectStatus, string> = {
  Live: '#10B981',
  'In Progress': '#00D1FF',
  Archive: '#003D9B',
}

/*
 * NOTE: the card summaries come from the original design.
 * Everything else (overview, challenge, approach, outcomes, topology and the
 * sample configs) is DRAFT copy written from those summaries — edit it with
 * the real project details. Configs use documentation IP ranges and private
 * ASNs on purpose.
 */
export const projects: Project[] = [
  {
    slug: 'enterprise-network-redesign',
    status: 'Live',
    tagline: 'BGP Config | High Availability',
    title: 'Enterprise Network Redesign',
    summary:
      'Designed and implemented a large-scale enterprise network infrastructure, focusing on BGP high availability and routing to minimize downtime.',
    tags: ['Cisco', 'BGP', 'OSPF'],
    image:
      '/Enterprise-Network.png',
    imageAlt: 'Enterprise Network Redesign topology diagram',
    role: 'Network design & implementation',
    overview:
      'A redesign of a large-scale enterprise network with one goal: keep the business online when a link, a router or a provider fails. The new design uses redundant edge and core layers, BGP for external connectivity and OSPF inside the network, so traffic re-routes automatically instead of waiting for manual intervention.',
    challenge:
      'A large network is only as reliable as its weakest single point of failure. The design had to remove those points, keep routing policy predictable across several providers, and make failover fast enough that users do not notice it.',
    approach: [
      {
        title: 'Assess the current network',
        text: 'Mapped links, devices and traffic flows to find single points of failure and routing behaviour that depended on manual changes.',
      },
      {
        title: 'Design for redundancy',
        text: 'Dual edge routers, dual upstream providers and a redundant core, so no single device or link carries all the traffic.',
      },
      {
        title: 'Implement BGP and OSPF policy',
        text: 'eBGP towards providers with prefix filtering and preference policy, OSPF as the internal protocol, and BFD for fast failure detection.',
      },
      {
        title: 'Test failover and hand over',
        text: 'Failed links and devices on purpose during maintenance windows to confirm convergence, then documented the design and configuration.',
      },
    ],
    outcomes: [
      'Automatic failover between redundant paths, with no manual intervention',
      'Predictable routing through explicit BGP policy and prefix filtering',
      'Lower downtime risk from a single link, device or provider failure',
    ],
    stack: [
      { group: 'Protocols', items: ['BGP', 'OSPF', 'BFD'] },
      { group: 'Platforms', items: ['Cisco'] },
      { group: 'Focus', items: ['High availability', 'Routing policy'] },
    ],
    topology: {
      caption: 'Dual-provider edge with a redundant core. Simplified.',
      nodes: [
        { id: 'isp-a', label: 'ISP A', kind: 'cloud', x: 160, y: 40 },
        { id: 'isp-b', label: 'ISP B', kind: 'cloud', x: 480, y: 40 },
        { id: 'edge-1', label: 'Edge R1', sub: 'BGP', kind: 'router', x: 160, y: 125 },
        { id: 'edge-2', label: 'Edge R2', sub: 'BGP', kind: 'router', x: 480, y: 125 },
        { id: 'core-1', label: 'Core 1', sub: 'OSPF', kind: 'switch', x: 160, y: 215 },
        { id: 'core-2', label: 'Core 2', sub: 'OSPF', kind: 'switch', x: 480, y: 215 },
        { id: 'access', label: 'Access layer', kind: 'site', x: 320, y: 300 },
      ],
      links: [
        { from: 'isp-a', to: 'edge-1', label: 'eBGP' },
        { from: 'isp-b', to: 'edge-2', label: 'eBGP' },
        { from: 'edge-1', to: 'edge-2', label: 'iBGP' },
        { from: 'edge-1', to: 'core-1' },
        { from: 'edge-2', to: 'core-2' },
        { from: 'edge-1', to: 'core-2' },
        { from: 'edge-2', to: 'core-1' },
        { from: 'core-1', to: 'core-2' },
        { from: 'core-1', to: 'access' },
        { from: 'core-2', to: 'access' },
      ],
    },
    config: {
      filename: 'edge-r1.cfg',
      language: 'Cisco IOS',
      note: 'Sanitized sample: eBGP with BFD, inbound filtering and two equal paths.',
      code: `router bgp 65001
 bgp router-id 10.0.0.1
 bgp log-neighbor-changes
 neighbor 203.0.113.2 remote-as 65010
 neighbor 203.0.113.2 description ISP-A
 neighbor 203.0.113.2 fall-over bfd
 !
 address-family ipv4 unicast
  network 192.0.2.0 mask 255.255.255.0
  neighbor 203.0.113.2 activate
  neighbor 203.0.113.2 prefix-list ISP-A-IN in
  neighbor 203.0.113.2 route-map ISP-A-PREF in
  maximum-paths 2
 exit-address-family
!
route-map ISP-A-PREF permit 10
 set local-preference 200`,
    },
  },
  {
    slug: 'secure-vpn-implementation',
    status: 'In Progress',
    tagline: 'IPSec | Zero Trust',
    title: 'Secure VPN Implementation',
    summary:
      'Developed and deployed secure VPN solutions based on IPSec to connect multiple branches with high security and Zero Trust Architecture implementation.',
    tags: ['Juniper', 'IPSec', 'Security'],
    image:
      '/public/Secure-VPN-Implementation.png',
    imageAlt: 'Juniper network hardware used for the VPN implementation',
    role: 'Security design & deployment',
    overview:
      'Secure site-to-site connectivity between the head office and several branches using IPsec VPNs on Juniper firewalls. The design follows Zero Trust principles: every connection is authenticated and encrypted, and each branch can reach only the services it actually needs.',
    challenge:
      'Branches needed reliable, encrypted connectivity, but a flat VPN that trusts every site equally would let one compromised branch reach everything. The goal was strong encryption and strict access boundaries at the same time.',
    approach: [
      {
        title: 'Define the trust model',
        text: 'Segmented traffic per branch and decided, service by service, what each site is allowed to reach.',
      },
      {
        title: 'Build the IPsec tunnels',
        text: 'Route-based VPNs with strong IKE and IPsec proposals, perfect forward secrecy and dedicated tunnel interfaces per branch.',
      },
      {
        title: 'Apply Zero Trust policies',
        text: 'Security zones and least-privilege policies so traffic between sites is denied unless a rule explicitly allows it.',
      },
      {
        title: 'Roll out branch by branch',
        text: 'Validated each tunnel and its policies before adding the next branch, keeping the same template for every site.',
      },
    ],
    outcomes: [
      'Encrypted connectivity between the head office and every branch',
      'Least-privilege access between sites instead of a flat network',
      'A repeatable template for onboarding new branches',
    ],
    stack: [
      { group: 'Security', items: ['IPsec', 'IKE', 'Zero Trust'] },
      { group: 'Platforms', items: ['Juniper'] },
      { group: 'Focus', items: ['Branch connectivity', 'Segmentation'] },
    ],
    topology: {
      caption: 'Hub-and-spoke IPsec tunnels over the internet. Simplified.',
      nodes: [
        { id: 'hq', label: 'HQ firewall', sub: 'Juniper', kind: 'firewall', x: 320, y: 50 },
        { id: 'inet', label: 'Internet', kind: 'cloud', x: 320, y: 160 },
        { id: 'br-a', label: 'Branch A', kind: 'site', x: 110, y: 275 },
        { id: 'br-b', label: 'Branch B', kind: 'site', x: 320, y: 290 },
        { id: 'br-c', label: 'Branch C', kind: 'site', x: 530, y: 275 },
      ],
      links: [
        { from: 'hq', to: 'inet', label: 'WAN' },
        { from: 'inet', to: 'br-a', label: 'IPsec', dashed: true },
        { from: 'inet', to: 'br-b', label: 'IPsec', dashed: true },
        { from: 'inet', to: 'br-c', label: 'IPsec', dashed: true },
      ],
    },
    config: {
      filename: 'hq-srx.conf',
      language: 'Junos',
      note: 'Sanitized sample: one route-based IPsec tunnel. The pre-shared key is redacted.',
      code: `set security ike proposal IKE-PROP authentication-method pre-shared-keys
set security ike proposal IKE-PROP dh-group group14
set security ike proposal IKE-PROP authentication-algorithm sha-256
set security ike proposal IKE-PROP encryption-algorithm aes-256-cbc
set security ike policy IKE-POL mode main
set security ike policy IKE-POL proposals IKE-PROP
set security ike policy IKE-POL pre-shared-key ascii-text "<redacted>"
set security ike gateway BRANCH-A-GW ike-policy IKE-POL
set security ike gateway BRANCH-A-GW address 198.51.100.10
set security ike gateway BRANCH-A-GW external-interface ge-0/0/0
set security ipsec proposal IPSEC-PROP protocol esp
set security ipsec proposal IPSEC-PROP authentication-algorithm hmac-sha-256-128
set security ipsec proposal IPSEC-PROP encryption-algorithm aes-256-cbc
set security ipsec policy IPSEC-POL perfect-forward-secrecy keys group14
set security ipsec policy IPSEC-POL proposals IPSEC-PROP
set security ipsec vpn BRANCH-A-VPN bind-interface st0.0
set security ipsec vpn BRANCH-A-VPN ike gateway BRANCH-A-GW
set security ipsec vpn BRANCH-A-VPN ike ipsec-policy IPSEC-POL`,
    },
  },
  {
    slug: 'cloud-hybrid-infrastructure',
    status: 'Archive',
    tagline: 'AWS Transit Gateway | Automation',
    title: 'Cloud Hybrid Infrastructure',
    summary:
      'Designed a hybrid environment connecting on-premise data centers to AWS cloud using Transit Gateway with configuration automation via Python.',
    tags: ['AWS', 'Python', 'Terraform'],
    image:
      '/public/Hybrid Cloud Architecture.jpg',
    imageAlt: 'Cloud hybrid infrastructure visualization',
    role: 'Cloud network design & automation',
    overview:
      'A hybrid network connecting on-premise data centers to AWS through a Transit Gateway. Configuration is generated and applied with Python and Terraform, so every new VPC attachment follows the same tested pattern.',
    challenge:
      'Connecting a data center to several VPCs one link at a time gets hard to manage and easy to get wrong. The goal was a single hub with clear routing rules, and automation that removes manual configuration steps.',
    approach: [
      {
        title: 'Plan address space and routing',
        text: 'Non-overlapping CIDR ranges and separate route tables for each type of attachment, decided before building anything.',
      },
      {
        title: 'Build the Transit Gateway hub',
        text: 'One Transit Gateway with VPC attachments and a VPN attachment to the on-premise data center.',
      },
      {
        title: 'Automate the configuration',
        text: 'Terraform for the AWS side and Python to generate device configuration, all stored in version control.',
      },
      {
        title: 'Validate connectivity',
        text: 'Tested reachability between the data center and each VPC, in both directions, before handover.',
      },
    ],
    outcomes: [
      'One hub connecting the data center and multiple VPCs',
      'Repeatable, version-controlled configuration',
      'Fewer manual steps, so fewer configuration mistakes',
    ],
    stack: [
      { group: 'Cloud', items: ['AWS', 'Transit Gateway'] },
      { group: 'Automation', items: ['Python', 'Terraform'] },
      { group: 'Focus', items: ['Hybrid connectivity'] },
    ],
    topology: {
      caption: 'Transit Gateway as the hub between the data center and the VPCs. Simplified.',
      nodes: [
        { id: 'dc', label: 'On-prem DC', kind: 'site', x: 90, y: 170 },
        { id: 'cgw', label: 'Customer GW', kind: 'router', x: 250, y: 170 },
        { id: 'tgw', label: 'Transit Gateway', sub: 'AWS', kind: 'cloud', x: 410, y: 170 },
        { id: 'vpc-a', label: 'VPC A', kind: 'cloud', x: 550, y: 70 },
        { id: 'vpc-b', label: 'VPC B', kind: 'cloud', x: 550, y: 170 },
        { id: 'vpc-c', label: 'VPC C', kind: 'cloud', x: 550, y: 270 },
        { id: 'auto', label: 'Python + Terraform', kind: 'site', x: 330, y: 295 },
      ],
      links: [
        { from: 'dc', to: 'cgw' },
        { from: 'cgw', to: 'tgw', label: 'VPN', dashed: true },
        { from: 'tgw', to: 'vpc-a' },
        { from: 'tgw', to: 'vpc-b' },
        { from: 'tgw', to: 'vpc-c' },
        { from: 'auto', to: 'tgw', label: 'automation', dashed: true },
      ],
    },
    config: {
      filename: 'transit-gateway.tf',
      language: 'Terraform',
      note: 'Sanitized sample: a Transit Gateway with one VPC attachment.',
      code: `resource "aws_ec2_transit_gateway" "hub" {
  description                     = "Hybrid connectivity hub"
  amazon_side_asn                 = 64512
  default_route_table_association = "disable"
  default_route_table_propagation = "disable"

  tags = {
    Name = "hybrid-tgw"
  }
}

resource "aws_ec2_transit_gateway_vpc_attachment" "app" {
  transit_gateway_id = aws_ec2_transit_gateway.hub.id
  vpc_id             = var.app_vpc_id
  subnet_ids         = var.app_private_subnet_ids

  tags = {
    Name = "app-vpc-attachment"
  }
}`,
    },
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/** Previous / next project, wrapping around. */
export function getNeighbours(slug: string): { prev: Project; next: Project } | undefined {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return undefined
  const prev = projects[(i - 1 + projects.length) % projects.length]!
  const next = projects[(i + 1) % projects.length]!
  return { prev, next }
}
